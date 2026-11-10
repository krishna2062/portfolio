using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Project
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(250)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string Path { get; set; } = string.Empty; // Image path or URL

    [Required]
    [MaxLength(1000)]
    public string Link { get; set; } = "https://krishnabhandari01.com.np";

    [MaxLength(1000)]
    public string? GithubUrl { get; set; }

    [Required]
    [MaxLength(3000)]
    public string Description { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsFeatured { get; set; } = true;
    public bool IsPublished { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public List<ProjectTechnology> Technologies { get; set; } = new();
}

public class ProjectTechnology
{
    [Key]
    public int Id { get; set; }

    public int ProjectId { get; set; }
    public Project? Project { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

