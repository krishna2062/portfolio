using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class BlogPost
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(350)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Summary { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ThumbnailUrl { get; set; }

    public int? CategoryId { get; set; }
    public BlogCategory? Category { get; set; }

    [MaxLength(200)]
    public string Author { get; set; } = "Krishna Bhandari";

    public bool IsPublished { get; set; } = false;
    public DateTime? PublishedAtUtc { get; set; }

    [MaxLength(200)]
    public string? SeoTitle { get; set; }

    [MaxLength(500)]
    public string? SeoDescription { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public List<BlogTagMapping> TagMappings { get; set; } = new();
}

public class BlogCategory
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Slug { get; set; } = string.Empty;

    public List<BlogPost> Posts { get; set; } = new();
}

public class BlogTag
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Slug { get; set; } = string.Empty;

    public List<BlogTagMapping> TagMappings { get; set; } = new();
}

public class BlogTagMapping
{
    public int BlogPostId { get; set; }
    public BlogPost? BlogPost { get; set; }

    public int BlogTagId { get; set; }
    public BlogTag? BlogTag { get; set; }
}

