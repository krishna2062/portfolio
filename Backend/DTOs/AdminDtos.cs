using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class DashboardSummaryDto
{
    public int TotalProjects { get; set; }
    public int PublishedProjects { get; set; }
    public int TotalServices { get; set; }
    public int TotalSkills { get; set; }
    public int TotalEducation { get; set; }
    public int TotalBlogs { get; set; }
    public int PublishedBlogs { get; set; }
    public int UnreadMessages { get; set; }
    public int TotalMessages { get; set; }
    public List<ContactMessageAdminDto> RecentMessages { get; set; } = new();
    public List<AuditLogDto> RecentLogs { get; set; } = new();
}

public class UpdateProfileDto
{
    [Required]
    [MaxLength(200)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string BrandTitle { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string HeroTitleLine1 { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string HeroTitleLine2 { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string HeroHighlight { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Subtitle { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ProfileImageUrl { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? CvDownloadUrl { get; set; }

    [MaxLength(200)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(100)]
    public string PhoneWhatsApp { get; set; } = string.Empty;

    [MaxLength(256)]
    public string ContactEmail { get; set; } = string.Empty;

    [MaxLength(256)]
    public string DomainEmail { get; set; } = string.Empty;
}

public class UpdateAboutDto
{
    [Required]
    [MaxLength(200)]
    public string Headline { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string HeadlineAccent { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }
    public int CompletedProjects { get; set; }
    public int TechMasteredCount { get; set; }
}

public class AboutTabCreateUpdateDto
{
    [Required]
    [MaxLength(50)]
    public string TabKey { get; set; } = "experience";

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Subtitle { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ProjectCreateUpdateDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(250)]
    public string? Slug { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Path { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Link { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? GithubUrl { get; set; }

    [Required]
    [MaxLength(3000)]
    public string Description { get; set; } = string.Empty;

    public List<string> Technologies { get; set; } = new();

    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; } = true;
    public bool IsPublished { get; set; } = true;
}

public class ServiceCreateUpdateDto
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string IconKey { get; set; } = "RxDesktop";

    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}

public class SkillCategoryCreateUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public List<string> SkillNames { get; set; } = new();
}

public class EducationCreateUpdateDto
{
    [Required]
    [MaxLength(200)]
    public string Degree { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Institution { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Status { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsPublished { get; set; } = true;
}

public class BlogPostCreateUpdateDto
{
    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(350)]
    public string? Slug { get; set; }

    [MaxLength(1000)]
    public string Summary { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ThumbnailUrl { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }

    public List<string> Tags { get; set; } = new();

    [MaxLength(200)]
    public string Author { get; set; } = "Krishna Bhandari";

    public bool IsPublished { get; set; }

    [MaxLength(200)]
    public string? SeoTitle { get; set; }

    [MaxLength(500)]
    public string? SeoDescription { get; set; }
}

public class ContactMessageAdminDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? ClientIp { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class MessageStatusUpdateDto
{
    [Required]
    [RegularExpression("^(Unread|Read|Replied|Archived)$")]
    public string Status { get; set; } = "Read";
}

public class AuditLogDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? Details { get; set; }
    public DateTime TimestampUtc { get; set; }
}

public class SettingUpdateDto
{
    [Required]
    public string Value { get; set; } = string.Empty;
}

