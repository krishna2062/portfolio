using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class AboutSection
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Headline { get; set; } = "Passionate software";

    [Required]
    [MaxLength(200)]
    public string HeadlineAccent { get; set; } = "engineer based in Nepal.";

    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = "Focused on building scalable enterprise solutions, performant REST APIs, clean database designs, and hardware-software telemetry integrations.";

    [MaxLength(500)]
    public string ImageUrl { get; set; } = "/assets/krishna.png";

    public int YearsOfExperience { get; set; } = 2;
    public int CompletedProjects { get; set; } = 10;
    public int TechMasteredCount { get; set; } = 8;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public List<AboutTab> Tabs { get; set; } = new();
}

public class AboutTab
{
    [Key]
    public int Id { get; set; }

    public int AboutSectionId { get; set; }
    public AboutSection? AboutSection { get; set; }

    [Required]
    [MaxLength(50)]
    public string TabKey { get; set; } = "experience"; // "experience" or "status"

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

