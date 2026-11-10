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
public class SettingsController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public SettingsController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.WebsiteSettings.ToListAsync();
        return Ok(settings);
    }

    [HttpPut("{key}")]
    public async Task<IActionResult> UpdateSetting(string key, [FromBody] SettingUpdateDto dto)
    {
        var setting = await _context.WebsiteSettings.FindAsync(key);
        if (setting == null)
        {
            setting = new WebsiteSetting { Key = key, Value = dto.Value, UpdatedAtUtc = DateTime.UtcNow };
            await _context.WebsiteSettings.AddAsync(setting);
        }
        else
        {
            setting.Value = dto.Value;
            setting.UpdatedAtUtc = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
        return Ok(setting);
    }
}

