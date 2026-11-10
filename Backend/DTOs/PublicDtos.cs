using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class PublicProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string BrandTitle { get; set; } = string.Empty;
    public string HeroTitleLine1 { get; set; } = string.Empty;
    public string HeroTitleLine2 { get; set; } = string.Empty;
    public string HeroHighlight { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string ProfileImageUrl { get; set; } = string.Empty;
    public string? CvDownloadUrl { get; set; }
    public string Location { get; set; } = string.Empty;
    public string PhoneWhatsApp { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string DomainEmail { get; set; } = string.Empty;
    public List<SocialLinkDto> SocialLinks { get; set; } = new();
    public List<TelemetryBadgeDto> Badges { get; set; } = new();
}

public class SocialLinkDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string IconKey { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class TelemetryBadgeDto
{
    public int Id { get; set; }
    public string BadgeKey { get; set; } = string.Empty;
    public string ContentJson { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class PublicAboutDto
{
    public string Headline { get; set; } = string.Empty;
    public string HeadlineAccent { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public int CompletedProjects { get; set; }
    public int TechMasteredCount { get; set; }
    public List<AboutTabDto> Tabs { get; set; } = new();
}

public class AboutTabDto
{
    public int Id { get; set; }
    public string TabKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class PublicSkillCategoryDto
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string SkillsJoined { get; set; } = string.Empty;
    public List<string> SkillsList { get; set; } = new();
}

public class PublicEducationDto
{
    public int Id { get; set; }
    public string Degree { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class PublicServiceDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string IconKey { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class PublicProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string? GithubUrl { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<string> Tech { get; set; } = new();
    public int DisplayOrder { get; set; }
}

public class PublicBlogDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? Category { get; set; }
    public List<string> Tags { get; set; } = new();
    public string Author { get; set; } = string.Empty;
    public DateTime? PublishedAtUtc { get; set; }
}

public class ContactSubmissionDto
{
    [Required]
    [MinLength(3)]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(3)]
    [MaxLength(300)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MinLength(5)]
    [MaxLength(5000)]
    public string Message { get; set; } = string.Empty;
}

