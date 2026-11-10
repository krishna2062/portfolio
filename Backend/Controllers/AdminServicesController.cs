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
public class ServicesController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public ServicesController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetServices()
    {
        var services = await _context.Services.OrderBy(s => s.DisplayOrder).ToListAsync();
        return Ok(services);
    }

    [HttpPost]
    public async Task<IActionResult> CreateService([FromBody] ServiceCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var service = new Service
        {
            Title = dto.Title,
            Description = dto.Description,
            IconKey = dto.IconKey,
            DisplayOrder = dto.DisplayOrder,
            IsPublished = dto.IsPublished,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _context.Services.AddAsync(service);
        await _context.SaveChangesAsync();
        return Ok(service);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateService(int id, [FromBody] ServiceCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var service = await _context.Services.FindAsync(id);
        if (service == null) return NotFound();

        service.Title = dto.Title;
        service.Description = dto.Description;
        service.IconKey = dto.IconKey;
        service.DisplayOrder = dto.DisplayOrder;
        service.IsPublished = dto.IsPublished;

        await _context.SaveChangesAsync();
        return Ok(service);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteService(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null) return NotFound();

        _context.Services.Remove(service);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Service deleted." });
    }

    [HttpPatch("{id}/publish")]
    public async Task<IActionResult> TogglePublish(int id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service == null) return NotFound();

        service.IsPublished = !service.IsPublished;
        await _context.SaveChangesAsync();
        return Ok(new { id = service.Id, isPublished = service.IsPublished });
    }
}

