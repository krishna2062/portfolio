using System.Text.RegularExpressions;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/[controller]")]
public class BlogsController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public BlogsController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBlogs()
    {
        var blogs = await _context.BlogPosts
            .Include(b => b.Category)
            .Include(b => b.TagMappings).ThenInclude(tm => tm.BlogTag)
            .OrderByDescending(b => b.CreatedAtUtc)
            .Select(b => new
            {
                b.Id,
                b.Title,
                b.Slug,
                b.Summary,
                b.ThumbnailUrl,
                Category = b.Category != null ? b.Category.Name : null,
                Tags = b.TagMappings.Select(tm => tm.BlogTag!.Name).ToList(),
                b.Author,
                b.IsPublished,
                b.PublishedAtUtc,
                b.CreatedAtUtc
            })
            .ToListAsync();

        return Ok(blogs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBlog(int id)
    {
        var blog = await _context.BlogPosts
            .Include(b => b.Category)
            .Include(b => b.TagMappings).ThenInclude(tm => tm.BlogTag)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (blog == null) return NotFound();

        return Ok(new
        {
            blog.Id,
            blog.Title,
            blog.Slug,
            blog.Summary,
            blog.Content,
            blog.ThumbnailUrl,
            Category = blog.Category != null ? blog.Category.Name : null,
            Tags = blog.TagMappings.Select(tm => tm.BlogTag!.Name).ToList(),
            blog.Author,
            blog.IsPublished,
            blog.SeoTitle,
            blog.SeoDescription,
            blog.PublishedAtUtc,
            blog.CreatedAtUtc
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateBlog([FromBody] BlogPostCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var slug = string.IsNullOrWhiteSpace(dto.Slug) ? GenerateSlug(dto.Title) : GenerateSlug(dto.Slug);
        if (await _context.BlogPosts.AnyAsync(b => b.Slug == slug))
        {
            slug = $"{slug}-{DateTime.UtcNow.Ticks % 10000}";
        }

        BlogCategory? category = null;
        if (!string.IsNullOrWhiteSpace(dto.Category))
        {
            var catName = dto.Category.Trim();
            category = await _context.BlogCategories.FirstOrDefaultAsync(c => c.Name == catName);
            if (category == null)
            {
                category = new BlogCategory { Name = catName, Slug = GenerateSlug(catName) };
                await _context.BlogCategories.AddAsync(category);
                await _context.SaveChangesAsync();
            }
        }

        var blog = new BlogPost
        {
            Title = dto.Title,
            Slug = slug,
            Summary = dto.Summary,
            Content = dto.Content,
            ThumbnailUrl = dto.ThumbnailUrl,
            CategoryId = category?.Id,
            Author = dto.Author,
            IsPublished = dto.IsPublished,
            PublishedAtUtc = dto.IsPublished ? DateTime.UtcNow : null,
            SeoTitle = dto.SeoTitle,
            SeoDescription = dto.SeoDescription,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _context.BlogPosts.AddAsync(blog);
        await _context.SaveChangesAsync();

        // Process Tags
        if (dto.Tags != null && dto.Tags.Any())
        {
            foreach (var tagName in dto.Tags.Select(t => t.Trim()).Distinct())
            {
                var tag = await _context.BlogTags.FirstOrDefaultAsync(t => t.Name == tagName);
                if (tag == null)
                {
                    tag = new BlogTag { Name = tagName, Slug = GenerateSlug(tagName) };
                    await _context.BlogTags.AddAsync(tag);
                    await _context.SaveChangesAsync();
                }

                blog.TagMappings.Add(new BlogTagMapping { BlogPostId = blog.Id, BlogTagId = tag.Id });
            }
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, blog);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBlog(int id, [FromBody] BlogPostCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var blog = await _context.BlogPosts
            .Include(b => b.TagMappings)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (blog == null) return NotFound();

        blog.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.Slug) && dto.Slug != blog.Slug)
        {
            var newSlug = GenerateSlug(dto.Slug);
            if (await _context.BlogPosts.AnyAsync(b => b.Slug == newSlug && b.Id != id))
            {
                newSlug = $"{newSlug}-{DateTime.UtcNow.Ticks % 10000}";
            }
            blog.Slug = newSlug;
        }

        blog.Summary = dto.Summary;
        blog.Content = dto.Content;
        blog.ThumbnailUrl = dto.ThumbnailUrl;
        blog.Author = dto.Author;
        blog.SeoTitle = dto.SeoTitle;
        blog.SeoDescription = dto.SeoDescription;

        if (dto.IsPublished && !blog.IsPublished)
        {
            blog.PublishedAtUtc = DateTime.UtcNow;
        }
        blog.IsPublished = dto.IsPublished;
        blog.UpdatedAtUtc = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(dto.Category))
        {
            var catName = dto.Category.Trim();
            var category = await _context.BlogCategories.FirstOrDefaultAsync(c => c.Name == catName);
            if (category == null)
            {
                category = new BlogCategory { Name = catName, Slug = GenerateSlug(catName) };
                await _context.BlogCategories.AddAsync(category);
                await _context.SaveChangesAsync();
            }
            blog.CategoryId = category.Id;
        }

        // Update tags
        _context.BlogTagMappings.RemoveRange(blog.TagMappings);
        if (dto.Tags != null && dto.Tags.Any())
        {
            foreach (var tagName in dto.Tags.Select(t => t.Trim()).Distinct())
            {
                var tag = await _context.BlogTags.FirstOrDefaultAsync(t => t.Name == tagName);
                if (tag == null)
                {
                    tag = new BlogTag { Name = tagName, Slug = GenerateSlug(tagName) };
                    await _context.BlogTags.AddAsync(tag);
                    await _context.SaveChangesAsync();
                }

                blog.TagMappings.Add(new BlogTagMapping { BlogPostId = blog.Id, BlogTagId = tag.Id });
            }
        }

        await _context.SaveChangesAsync();
        return Ok(blog);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBlog(int id)
    {
        var blog = await _context.BlogPosts.FindAsync(id);
        if (blog == null) return NotFound();

        _context.BlogPosts.Remove(blog);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Blog post deleted." });
    }

    [HttpPatch("{id}/publish")]
    public async Task<IActionResult> TogglePublish(int id)
    {
        var blog = await _context.BlogPosts.FindAsync(id);
        if (blog == null) return NotFound();

        blog.IsPublished = !blog.IsPublished;
        if (blog.IsPublished && !blog.PublishedAtUtc.HasValue)
        {
            blog.PublishedAtUtc = DateTime.UtcNow;
        }
        await _context.SaveChangesAsync();
        return Ok(new { id = blog.Id, isPublished = blog.IsPublished });
    }

    private static string GenerateSlug(string phrase)
    {
        string str = phrase.ToLowerInvariant();
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        str = Regex.Replace(str, @"\s+", " ").Trim();
        str = str.Substring(0, str.Length <= 100 ? str.Length : 100).Trim();
        str = Regex.Replace(str, @"\s", "-");
        return str;
    }
}

