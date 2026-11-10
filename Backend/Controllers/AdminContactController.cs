using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/[controller]")]
public class ContactController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public ContactController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet("messages")]
    public async Task<IActionResult> GetMessages([FromQuery] string? status, [FromQuery] string? search)
    {
        var query = _context.ContactMessages.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(m => m.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(m => m.Name.ToLower().Contains(term) ||
                                     m.Email.ToLower().Contains(term) ||
                                     m.Subject.ToLower().Contains(term) ||
                                     m.Message.ToLower().Contains(term));
        }

        var messages = await query
            .OrderByDescending(m => m.CreatedAtUtc)
            .Select(m => new ContactMessageAdminDto
            {
                Id = m.Id,
                Name = m.Name,
                Email = m.Email,
                Subject = m.Subject,
                Message = m.Message,
                ClientIp = m.ClientIp,
                Status = m.Status,
                CreatedAtUtc = m.CreatedAtUtc
            })
            .ToListAsync();

        return Ok(messages);
    }

    [HttpGet("messages/{id}")]
    public async Task<IActionResult> GetMessage(Guid id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();

        // Mark as Read if unread
        if (message.Status == "Unread")
        {
            message.Status = "Read";
            message.StatusUpdatedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        return Ok(message);
    }

    [HttpPatch("messages/{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] MessageStatusUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();

        message.Status = dto.Status;
        message.StatusUpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(message);
    }

    [HttpDelete("messages/{id}")]
    public async Task<IActionResult> DeleteMessage(Guid id)
    {
        var message = await _context.ContactMessages.FindAsync(id);
        if (message == null) return NotFound();

        _context.ContactMessages.Remove(message);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Message deleted successfully." });
    }
}

