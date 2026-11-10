using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/[controller]")]
public class MediaController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    private readonly IFileStorageService _storageService;

    public MediaController(PortfolioDbContext context, IFileStorageService storageService)
    {
        _context = context;
        _storageService = storageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMedia()
    {
        var list = await _context.MediaAssets.OrderByDescending(m => m.UploadedAtUtc).ToListAsync();
        return Ok(list);
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromForm] string? altText)
    {
        var (success, message, relativePath, fileSize) = await _storageService.SaveFileAsync(file);
        if (!success || relativePath == null)
            return BadRequest(new { message });

        var asset = new MediaAsset
        {
            OriginalFileName = file.FileName,
            RelativeUrl = relativePath,
            MimeType = file.ContentType,
            FileSizeBytes = fileSize,
            AltText = altText,
            UploadedAtUtc = DateTime.UtcNow
        };

        await _context.MediaAssets.AddAsync(asset);
        await _context.SaveChangesAsync();

        return Ok(asset);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedia(Guid id)
    {
        var asset = await _context.MediaAssets.FindAsync(id);
        if (asset == null) return NotFound();

        // Check if any project or blog is using this image
        var usedInProject = await _context.Projects.AnyAsync(p => p.Path == asset.RelativeUrl);
        var usedInBlog = await _context.BlogPosts.AnyAsync(b => b.ThumbnailUrl == asset.RelativeUrl);

        if (usedInProject || usedInBlog)
        {
            return BadRequest(new { message = "Cannot delete media asset because it is currently linked to published projects or blogs." });
        }

        _storageService.DeleteFile(asset.RelativeUrl);
        _context.MediaAssets.Remove(asset);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Media asset deleted." });
    }
}

