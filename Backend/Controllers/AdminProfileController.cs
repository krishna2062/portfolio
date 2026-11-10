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
public class ProfileController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public ProfileController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var profile = await _context.Profiles
            .Include(p => p.SocialLinks.OrderBy(s => s.DisplayOrder))
            .Include(p => p.TelemetryBadges.OrderBy(b => b.DisplayOrder))
            .FirstOrDefaultAsync();

        if (profile == null)
            return NotFound();

        return Ok(profile);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var profile = await _context.Profiles.FirstOrDefaultAsync();
        if (profile == null)
        {
            profile = new Profile();
            await _context.Profiles.AddAsync(profile);
        }

        profile.FullName = dto.FullName;
        profile.BrandTitle = dto.BrandTitle;
        profile.HeroTitleLine1 = dto.HeroTitleLine1;
        profile.HeroTitleLine2 = dto.HeroTitleLine2;
        profile.HeroHighlight = dto.HeroHighlight;
        profile.Subtitle = dto.Subtitle;
        profile.ProfileImageUrl = dto.ProfileImageUrl;
        profile.CvDownloadUrl = dto.CvDownloadUrl;
        profile.Location = dto.Location;
        profile.PhoneWhatsApp = dto.PhoneWhatsApp;
        profile.ContactEmail = dto.ContactEmail;
        profile.DomainEmail = dto.DomainEmail;
        profile.UpdatedAtUtc = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            Username = User.Identity?.Name ?? "Admin",
            Action = "UpdateProfile",
            EntityName = "Profile",
            EntityId = profile.Id.ToString(),
            Details = "Updated main profile information"
        });

        await _context.SaveChangesAsync();
        return Ok(profile);
    }

    [HttpPost("socials")]
    public async Task<IActionResult> AddSocialLink([FromBody] SocialLinkDto dto)
    {
        var profile = await _context.Profiles.FirstOrDefaultAsync();
        if (profile == null) return NotFound();

        var link = new SocialLink
        {
            ProfileId = profile.Id,
            Name = dto.Name,
            Link = dto.Link,
            IconKey = dto.IconKey,
            DisplayOrder = dto.DisplayOrder,
            IsActive = true
        };

        await _context.SocialLinks.AddAsync(link);
        await _context.SaveChangesAsync();
        return Ok(link);
    }

    [HttpDelete("socials/{id}")]
    public async Task<IActionResult> DeleteSocialLink(int id)
    {
        var link = await _context.SocialLinks.FindAsync(id);
        if (link == null) return NotFound();

        _context.SocialLinks.Remove(link);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Social link removed." });
    }
}

