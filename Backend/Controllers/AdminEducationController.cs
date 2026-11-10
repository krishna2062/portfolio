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
public class EducationController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public EducationController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetEducation()
    {
        var records = await _context.EducationRecords.OrderBy(e => e.DisplayOrder).ToListAsync();
        return Ok(records);
    }

    [HttpPost]
    public async Task<IActionResult> CreateEducation([FromBody] EducationCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var record = new EducationRecord
        {
            Degree = dto.Degree,
            Institution = dto.Institution,
            Status = dto.Status,
            DisplayOrder = dto.DisplayOrder,
            IsPublished = dto.IsPublished,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _context.EducationRecords.AddAsync(record);
        await _context.SaveChangesAsync();
        return Ok(record);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEducation(int id, [FromBody] EducationCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var record = await _context.EducationRecords.FindAsync(id);
        if (record == null) return NotFound();

        record.Degree = dto.Degree;
        record.Institution = dto.Institution;
        record.Status = dto.Status;
        record.DisplayOrder = dto.DisplayOrder;
        record.IsPublished = dto.IsPublished;

        await _context.SaveChangesAsync();
        return Ok(record);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEducation(int id)
    {
        var record = await _context.EducationRecords.FindAsync(id);
        if (record == null) return NotFound();

        _context.EducationRecords.Remove(record);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Education record deleted." });
    }
}

