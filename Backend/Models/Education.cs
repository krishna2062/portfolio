using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class EducationRecord
{
    [Key]
    public int Id { get; set; }

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
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

