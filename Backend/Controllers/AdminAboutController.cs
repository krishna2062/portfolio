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
public class AboutController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public AboutController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAbout()
    {
        var about = await _context.AboutSections
            .Include(a => a.Tabs.OrderBy(t => t.DisplayOrder))
            .FirstOrDefaultAsync();

        if (about == null)
            return NotFound();

        return Ok(about);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAbout([FromBody] UpdateAboutDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var about = await _context.AboutSections.FirstOrDefaultAsync();
        if (about == null)
        {
            about = new AboutSection();
            await _context.AboutSections.AddAsync(about);
        }

        about.Headline = dto.Headline;
        about.HeadlineAccent = dto.HeadlineAccent;
        about.Description = dto.Description;
        about.ImageUrl = dto.ImageUrl;
        about.YearsOfExperience = dto.YearsOfExperience;
        about.CompletedProjects = dto.CompletedProjects;
        about.TechMasteredCount = dto.TechMasteredCount;
        about.UpdatedAtUtc = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            Username = User.Identity?.Name ?? "Admin",
            Action = "UpdateAbout",
            EntityName = "AboutSection",
            EntityId = about.Id.ToString(),
            Details = "Updated about section and stats"
        });

        await _context.SaveChangesAsync();
        return Ok(about);
    }

    [HttpPost("tabs")]
    public async Task<IActionResult> CreateTab([FromBody] AboutTabCreateUpdateDto dto)
    {
        var about = await _context.AboutSections.FirstOrDefaultAsync();
        if (about == null) return NotFound();

        var tab = new AboutTab
        {
            AboutSectionId = about.Id,
            TabKey = dto.TabKey,
            Title = dto.Title,
            Subtitle = dto.Subtitle,
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        await _context.AboutTabs.AddAsync(tab);
        await _context.SaveChangesAsync();
        return Ok(tab);
    }

    [HttpPut("tabs/{id}")]
    public async Task<IActionResult> UpdateTab(int id, [FromBody] AboutTabCreateUpdateDto dto)
    {
        var tab = await _context.AboutTabs.FindAsync(id);
        if (tab == null) return NotFound();

        tab.TabKey = dto.TabKey;
        tab.Title = dto.Title;
        tab.Subtitle = dto.Subtitle;
        tab.Description = dto.Description;
        tab.DisplayOrder = dto.DisplayOrder;
        tab.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();
        return Ok(tab);
    }

    [HttpDelete("tabs/{id}")]
    public async Task<IActionResult> DeleteTab(int id)
    {
        var tab = await _context.AboutTabs.FindAsync(id);
        if (tab == null) return NotFound();

        _context.AboutTabs.Remove(tab);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Tab deleted." });
    }
}

