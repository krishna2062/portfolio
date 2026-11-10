using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public DashboardController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
    {
        var totalProjects = await _context.Projects.CountAsync();
        var publishedProjects = await _context.Projects.CountAsync(p => p.IsPublished);
        var totalServices = await _context.Services.CountAsync();
        var totalSkills = await _context.SkillItems.CountAsync();
        var totalEducation = await _context.EducationRecords.CountAsync();
        var totalBlogs = await _context.BlogPosts.CountAsync();
        var publishedBlogs = await _context.BlogPosts.CountAsync(b => b.IsPublished);
        var unreadMessages = await _context.ContactMessages.CountAsync(m => m.Status == "Unread");
        var totalMessages = await _context.ContactMessages.CountAsync();

        var recentMessages = await _context.ContactMessages
            .OrderByDescending(m => m.CreatedAtUtc)
            .Take(5)
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

        var recentLogs = await _context.AuditLogs
            .OrderByDescending(l => l.TimestampUtc)
            .Take(10)
            .Select(l => new AuditLogDto
            {
                Id = l.Id,
                Username = l.Username,
                Action = l.Action,
                EntityName = l.EntityName,
                EntityId = l.EntityId,
                Details = l.Details,
                TimestampUtc = l.TimestampUtc
            })
            .ToListAsync();

        return Ok(new DashboardSummaryDto
        {
            TotalProjects = totalProjects,
            PublishedProjects = publishedProjects,
            TotalServices = totalServices,
            TotalSkills = totalSkills,
            TotalEducation = totalEducation,
            TotalBlogs = totalBlogs,
            PublishedBlogs = publishedBlogs,
            UnreadMessages = unreadMessages,
            TotalMessages = totalMessages,
            RecentMessages = recentMessages,
            RecentLogs = recentLogs
        });
    }
}

