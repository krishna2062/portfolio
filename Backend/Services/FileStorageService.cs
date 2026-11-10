using Backend.Models;

namespace Backend.Services;

public interface IFileStorageService
{
    Task<(bool Success, string Message, string? FilePath, long FileSize)> SaveFileAsync(IFormFile file);
    bool DeleteFile(string relativePath);
}

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".svg", ".pdf"
    };

    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp", "image/svg+xml", "application/pdf"
    };

    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

    public FileStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<(bool Success, string Message, string? FilePath, long FileSize)> SaveFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return (false, "File is empty.", null, 0);
        }

        if (file.Length > MaxFileSizeBytes)
        {
            return (false, "File exceeds maximum allowed size of 10MB.", null, 0);
        }

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
        {
            return (false, $"File extension '{ext}' is not permitted.", null, 0);
        }

        if (!AllowedMimeTypes.Contains(file.ContentType))
        {
            return (false, $"MIME type '{file.ContentType}' is not permitted.", null, 0);
        }

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads");

        if (!Directory.Exists(uploadsDir))
        {
            Directory.CreateDirectory(uploadsDir);
        }

        var safeFileName = $"{Guid.NewGuid():N}{ext.ToLowerInvariant()}";
        var fullPath = Path.Combine(uploadsDir, safeFileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativeUrl = $"/uploads/{safeFileName}";
        return (true, "Upload successful.", relativeUrl, file.Length);
    }

    public bool DeleteFile(string relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath) || !relativePath.StartsWith("/uploads/"))
        {
            return false;
        }

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var fileName = Path.GetFileName(relativePath);
        var fullPath = Path.Combine(webRoot, "uploads", fileName);

        if (File.Exists(fullPath))
        {
            try
            {
                File.Delete(fullPath);
                return true;
            }
            catch
            {
                return false;
            }
        }

        return false;
    }
}

