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
public class SkillsController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public SkillsController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSkills()
    {
        var categories = await _context.SkillCategories
            .OrderBy(c => c.DisplayOrder)
            .Include(c => c.Items.OrderBy(i => i.DisplayOrder))
            .ToListAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] SkillCategoryCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var category = new SkillCategory
        {
            Category = dto.Category,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive,
            Items = dto.SkillNames.Select((name, idx) => new SkillItem
            {
                Name = name.Trim(),
                DisplayOrder = idx + 1
            }).ToList()
        };

        await _context.SkillCategories.AddAsync(category);
        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] SkillCategoryCreateUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var category = await _context.SkillCategories
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return NotFound();

        category.Category = dto.Category;
        category.DisplayOrder = dto.DisplayOrder;
        category.IsActive = dto.IsActive;

        _context.SkillItems.RemoveRange(category.Items);
        category.Items = dto.SkillNames.Select((name, idx) => new SkillItem
        {
            Name = name.Trim(),
            DisplayOrder = idx + 1
        }).ToList();

        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.SkillCategories.FindAsync(id);
        if (category == null) return NotFound();

        _context.SkillCategories.Remove(category);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Skill category deleted." });
    }
}

