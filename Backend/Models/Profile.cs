using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Profile
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string FullName { get; set; } = "Krishna Prasad Bhandari";

    [Required]
    [MaxLength(100)]
    public string BrandTitle { get; set; } = "Krishna.";

    [Required]
    [MaxLength(200)]
    public string HeroTitleLine1 { get; set; } = "Full Stack Developer";

    [Required]
    [MaxLength(200)]
    public string HeroTitleLine2 { get; set; } = "& Computer Engineering";

    [Required]
    [MaxLength(100)]
    public string HeroHighlight { get; set; } = "Student";

    [Required]
    [MaxLength(1000)]
    public string Subtitle { get; set; } = "Specializing in high-performance web applications, robust ASP.NET Core backend architecture, modern React interfaces, and hardware telemetry.";

    [MaxLength(500)]
    public string ProfileImageUrl { get; set; } = "/assets/krishna.png";

    [MaxLength(500)]
    public string? CvDownloadUrl { get; set; }

    [MaxLength(200)]
    public string Location { get; set; } = "Butwal, Lumbini Province, Nepal";

    [MaxLength(100)]
    public string PhoneWhatsApp { get; set; } = "+977 9867165211";

    [MaxLength(256)]
    public string ContactEmail { get; set; } = "krishnabhandari2062@gmail.com";

    [MaxLength(256)]
    public string DomainEmail { get; set; } = "contact@krishnabhandari01.com.np";

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<SocialLink> SocialLinks { get; set; } = new();
    public List<TelemetryBadge> TelemetryBadges { get; set; } = new();
}

public class SocialLink
{
    [Key]
    public int Id { get; set; }

    public int ProfileId { get; set; }
    public Profile? Profile { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Link { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string IconKey { get; set; } = string.Empty; // e.g. "RiGithubLine", "RiLinkedinLine"

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class TelemetryBadge
{
    [Key]
    public int Id { get; set; }

    public int ProfileId { get; set; }
    public Profile? Profile { get; set; }

    [Required]
    [MaxLength(100)]
    public string BadgeKey { get; set; } = string.Empty; // e.g. "telemetry_func", "sensor_data", "journey", "developer_obj", "build_activity"

    [Required]
    [MaxLength(1000)]
    public string ContentJson { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

