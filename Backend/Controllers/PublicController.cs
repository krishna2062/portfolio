using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public PublicController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<PublicProfileDto>> GetProfile()
    {
        var profile = await _context.Profiles
            .Include(p => p.SocialLinks.Where(s => s.IsActive).OrderBy(s => s.DisplayOrder))
            .Include(p => p.TelemetryBadges.Where(b => b.IsActive).OrderBy(b => b.DisplayOrder))
            .FirstOrDefaultAsync();

        if (profile == null)
            return NotFound(new { message = "Profile not found." });

        return Ok(new PublicProfileDto
        {
            FullName = profile.FullName,
            BrandTitle = profile.BrandTitle,
            HeroTitleLine1 = profile.HeroTitleLine1,
            HeroTitleLine2 = profile.HeroTitleLine2,
            HeroHighlight = profile.HeroHighlight,
            Subtitle = profile.Subtitle,
            ProfileImageUrl = profile.ProfileImageUrl,
            CvDownloadUrl = profile.CvDownloadUrl,
            Location = profile.Location,
            PhoneWhatsApp = profile.PhoneWhatsApp,
            ContactEmail = profile.ContactEmail,
            DomainEmail = profile.DomainEmail,
            SocialLinks = profile.SocialLinks.Select(s => new SocialLinkDto
            {
                Id = s.Id,
                Name = s.Name,
                Link = s.Link,
                IconKey = s.IconKey,
                DisplayOrder = s.DisplayOrder
            }).ToList(),
            Badges = profile.TelemetryBadges.Select(b => new TelemetryBadgeDto
            {
                Id = b.Id,
                BadgeKey = b.BadgeKey,
                ContentJson = b.ContentJson,
                DisplayOrder = b.DisplayOrder
            }).ToList()
        });
    }

    [HttpGet("about")]
    public async Task<ActionResult<PublicAboutDto>> GetAbout()
    {
        var about = await _context.AboutSections
            .Include(a => a.Tabs.Where(t => t.IsActive).OrderBy(t => t.DisplayOrder))
            .FirstOrDefaultAsync();

        if (about == null)
            return NotFound(new { message = "About section not found." });

        return Ok(new PublicAboutDto
        {
            Headline = about.Headline,
            HeadlineAccent = about.HeadlineAccent,
            Description = about.Description,
            ImageUrl = about.ImageUrl,
            YearsOfExperience = about.YearsOfExperience,
            CompletedProjects = about.CompletedProjects,
            TechMasteredCount = about.TechMasteredCount,
            Tabs = about.Tabs.Select(t => new AboutTabDto
            {
                Id = t.Id,
                TabKey = t.TabKey,
                Title = t.Title,
                Subtitle = t.Subtitle,
                Description = t.Description,
                DisplayOrder = t.DisplayOrder
            }).ToList()
        });
    }

    [HttpGet("skills")]
    public async Task<ActionResult<List<PublicSkillCategoryDto>>> GetSkills()
    {
        var categories = await _context.SkillCategories
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Include(c => c.Items.OrderBy(i => i.DisplayOrder))
            .ToListAsync();

        var result = categories.Select(c => new PublicSkillCategoryDto
        {
            Id = c.Id,
            Category = c.Category,
            SkillsJoined = string.Join(", ", c.Items.Select(i => i.Name)),
            SkillsList = c.Items.Select(i => i.Name).ToList()
        }).ToList();

        return Ok(result);
    }

    [HttpGet("education")]
    public async Task<ActionResult<List<PublicEducationDto>>> GetEducation()
    {
        var records = await _context.EducationRecords
            .Where(e => e.IsPublished)
            .OrderBy(e => e.DisplayOrder)
            .Select(e => new PublicEducationDto
            {
                Id = e.Id,
                Degree = e.Degree,
                Institution = e.Institution,
                Status = e.Status,
                DisplayOrder = e.DisplayOrder
            })
            .ToListAsync();

        return Ok(records);
    }

    [HttpGet("services")]
    public async Task<ActionResult<List<PublicServiceDto>>> GetServices()
    {
        var services = await _context.Services
            .Where(s => s.IsPublished)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new PublicServiceDto
            {
                Id = s.Id,
                Title = s.Title,
                Description = s.Description,
                IconKey = s.IconKey,
                DisplayOrder = s.DisplayOrder
            })
            .ToListAsync();

        return Ok(services);
    }

    [HttpGet("projects")]
    public async Task<ActionResult<List<PublicProjectDto>>> GetProjects()
    {
        var projects = await _context.Projects
            .Where(p => p.IsPublished)
            .OrderBy(p => p.DisplayOrder)
            .Include(p => p.Technologies)
            .Select(p => new PublicProjectDto
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Path = p.Path,
                Link = p.Link,
                GithubUrl = p.GithubUrl,
                Description = p.Description,
                Tech = p.Technologies.Select(t => t.Name).ToList(),
                DisplayOrder = p.DisplayOrder
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("projects/{slug}")]
    public async Task<ActionResult<PublicProjectDto>> GetProjectBySlug(string slug)
    {
        var p = await _context.Projects
            .Include(p => p.Technologies)
            .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);

        if (p == null)
            return NotFound(new { message = "Project not found." });

        return Ok(new PublicProjectDto
        {
            Id = p.Id,
            Title = p.Title,
            Slug = p.Slug,
            Path = p.Path,
            Link = p.Link,
            GithubUrl = p.GithubUrl,
            Description = p.Description,
            Tech = p.Technologies.Select(t => t.Name).ToList(),
            DisplayOrder = p.DisplayOrder
        });
    }

    [HttpGet("blogs")]
    public async Task<ActionResult<List<PublicBlogDto>>> GetBlogs()
    {
        var blogs = await _context.BlogPosts
            .Where(b => b.IsPublished)
            .OrderByDescending(b => b.PublishedAtUtc ?? b.CreatedAtUtc)
            .Include(b => b.Category)
            .Include(b => b.TagMappings).ThenInclude(tm => tm.BlogTag)
            .Select(b => new PublicBlogDto
            {
                Id = b.Id,
                Title = b.Title,
                Slug = b.Slug,
                Summary = b.Summary,
                Content = b.Content,
                ThumbnailUrl = b.ThumbnailUrl,
                Category = b.Category != null ? b.Category.Name : null,
                Tags = b.TagMappings.Select(tm => tm.BlogTag!.Name).ToList(),
                Author = b.Author,
                PublishedAtUtc = b.PublishedAtUtc
            })
            .ToListAsync();

        return Ok(blogs);
    }

    [HttpGet("blogs/{slug}")]
    public async Task<ActionResult<PublicBlogDto>> GetBlogBySlug(string slug)
    {
        var b = await _context.BlogPosts
            .Include(b => b.Category)
            .Include(b => b.TagMappings).ThenInclude(tm => tm.BlogTag)
            .FirstOrDefaultAsync(b => b.Slug == slug && b.IsPublished);

        if (b == null)
            return NotFound(new { message = "Article not found." });

        return Ok(new PublicBlogDto
        {
            Id = b.Id,
            Title = b.Title,
            Slug = b.Slug,
            Summary = b.Summary,
            Content = b.Content,
            ThumbnailUrl = b.ThumbnailUrl,
            Category = b.Category != null ? b.Category.Name : null,
            Tags = b.TagMappings.Select(tm => tm.BlogTag!.Name).ToList(),
            Author = b.Author,
            PublishedAtUtc = b.PublishedAtUtc
        });
    }

    [HttpPost("contact")]
    public async Task<IActionResult> SubmitContact([FromBody] ContactSubmissionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var userAgent = Request.Headers.UserAgent.ToString();

        var message = new ContactMessage
        {
            Name = dto.Name.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            Subject = dto.Subject.Trim(),
            Message = dto.Message.Trim(),
            ClientIp = ip,
            UserAgent = userAgent,
            Status = "Unread",
            CreatedAtUtc = DateTime.UtcNow
        };

        await _context.ContactMessages.AddAsync(message);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            messageId = message.Id,
            message = "Thank you! Your message has been received securely."
        });
    }
}

