using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class ContactMessage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? ClientIp { get; set; }

    [MaxLength(500)]
    public string? UserAgent { get; set; }

    [MaxLength(50)]
    public string Status { get; set; } = "Unread"; // "Unread", "Read", "Replied", "Archived"

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? StatusUpdatedAtUtc { get; set; }
}

public class MediaAsset
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(260)]
    public string OriginalFileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string RelativeUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string MimeType { get; set; } = string.Empty;

    public long FileSizeBytes { get; set; }

    [MaxLength(300)]
    public string? AltText { get; set; }

    public DateTime UploadedAtUtc { get; set; } = DateTime.UtcNow;
}

public class WebsiteSetting
{
    [Key]
    [MaxLength(100)]
    public string Key { get; set; } = string.Empty;

    [Required]
    public string Value { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Description { get; set; }

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}

public class AuditLog
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(100)]
    public string Username { get; set; } = "System";

    [Required]
    [MaxLength(100)]
    public string Action { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string EntityName { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? EntityId { get; set; }

    [MaxLength(2000)]
    public string? Details { get; set; }

    public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
}

