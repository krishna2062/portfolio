using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class SkillCategory
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public List<SkillItem> Items { get; set; } = new();
}

public class SkillItem
{
    [Key]
    public int Id { get; set; }

    public int SkillCategoryId { get; set; }
    public SkillCategory? SkillCategory { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    public int? ProficiencyPercent { get; set; }
    public int DisplayOrder { get; set; }
}

