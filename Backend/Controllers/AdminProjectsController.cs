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
public class ProjectsController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public ProjectsController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects([FromQuery] string? search, [FromQuery] bool? isPublished)
    {
        var query = _context.Projects.Include(p => p.Technologies).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p => p.Title.ToLower().Contains(term) || p.Description.ToLower().Contains(term));
        }

        if (isPublished.HasValue)
        {
            query = query.Where(p => p.IsPublished == isPublished.Value);
        }

        var list = await query.OrderBy(p => p.DisplayOrder).ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProject(int id)
    {
        var project = await _context.Projects.Include(p => p.Technologies).FirstOrDefaultAsync(p => p.Id == id);
        if (project == null) return NotFound();
        return Ok(project);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] ProjectCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var slug = string.IsNullOrWhiteSpace(dto.Slug)
            ? GenerateSlug(dto.Title)
            : GenerateSlug(dto.Slug);

        // Ensure unique slug
        if (await _context.Projects.AnyAsync(p => p.Slug == slug))
        {
            slug = $"{slug}-{DateTime.UtcNow.Ticks % 10000}";
        }

        var project = new Project
        {
            Title = dto.Title,
            Slug = slug,
            Path = dto.Path,
            Link = dto.Link,
            GithubUrl = dto.GithubUrl,
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder,
            IsFeatured = dto.IsFeatured,
            IsPublished = dto.IsPublished,
            CreatedAtUtc = DateTime.UtcNow,
            Technologies = dto.Technologies.Select(t => new ProjectTechnology { Name = t.Trim() }).ToList()
        };

        await _context.Projects.AddAsync(project);

        _context.AuditLogs.Add(new AuditLog
        {
            Username = User.Identity?.Name ?? "Admin",
            Action = "CreateProject",
            EntityName = "Project",
            EntityId = project.Id.ToString(),
            Details = $"Created project: {project.Title}"
        });

        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var project = await _context.Projects.Include(p => p.Technologies).FirstOrDefaultAsync(p => p.Id == id);
        if (project == null) return NotFound();

        project.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.Slug) && dto.Slug != project.Slug)
        {
            var newSlug = GenerateSlug(dto.Slug);
            if (await _context.Projects.AnyAsync(p => p.Slug == newSlug && p.Id != id))
            {
                newSlug = $"{newSlug}-{DateTime.UtcNow.Ticks % 10000}";
            }
            project.Slug = newSlug;
        }

        project.Path = dto.Path;
        project.Link = dto.Link;
        project.GithubUrl = dto.GithubUrl;
        project.Description = dto.Description;
        project.DisplayOrder = dto.DisplayOrder;
        project.IsFeatured = dto.IsFeatured;
        project.IsPublished = dto.IsPublished;
        project.UpdatedAtUtc = DateTime.UtcNow;

        // Replace technologies
        _context.ProjectTechnologies.RemoveRange(project.Technologies);
        project.Technologies = dto.Technologies.Select(t => new ProjectTechnology { Name = t.Trim() }).ToList();

        _context.AuditLogs.Add(new AuditLog
        {
            Username = User.Identity?.Name ?? "Admin",
            Action = "UpdateProject",
            EntityName = "Project",
            EntityId = project.Id.ToString(),
            Details = $"Updated project: {project.Title}"
        });

        await _context.SaveChangesAsync();
        return Ok(project);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();

        _context.Projects.Remove(project);

        _context.AuditLogs.Add(new AuditLog
        {
            Username = User.Identity?.Name ?? "Admin",
            Action = "DeleteProject",
            EntityName = "Project",
            EntityId = id.ToString(),
            Details = $"Deleted project: {project.Title}"
        });

        await _context.SaveChangesAsync();
        return Ok(new { message = "Project deleted successfully." });
    }

    [HttpPatch("{id}/publish")]
    public async Task<IActionResult> TogglePublish(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();

        project.IsPublished = !project.IsPublished;
        project.UpdatedAtUtc = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { id = project.Id, isPublished = project.IsPublished });
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

