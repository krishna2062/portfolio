using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/[controller]")]
public class UsersController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public UsersController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .OrderBy(u => u.Role == "Owner" ? 0 : 1)
            .ThenBy(u => u.Username)
            .Select(u => new AdminUserResponseDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role,
                IsActive = u.IsActive,
                CreatedAtUtc = u.CreatedAtUtc,
                LastLoginUtc = u.LastLoginUtc
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        return Ok(new AdminUserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc,
            LastLoginUtc = user.LastLoginUtc
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] AdminUserCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var trimmedUsername = dto.Username.Trim();
        var trimmedEmail = dto.Email.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == trimmedUsername.ToLower()))
        {
            return BadRequest(new { message = "Username already exists." });
        }

        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == trimmedEmail))
        {
            return BadRequest(new { message = "Email already registered." });
        }

        var newUser = new User
        {
            Username = trimmedUsername,
            Email = trimmedEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = string.IsNullOrWhiteSpace(dto.Role) ? "Admin" : dto.Role.Trim(),
            IsActive = true,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _context.Users.AddAsync(newUser);

        _context.AuditLogs.Add(new AuditLog
        {
            Username = User.Identity?.Name ?? "Admin",
            Action = "CreateUser",
            EntityName = "User",
            EntityId = newUser.Id.ToString(),
            Details = $"Created admin user account: {newUser.Username} ({newUser.Role})"
        });

        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, new AdminUserResponseDto
        {
            Id = newUser.Id,
            Username = newUser.Username,
            Email = newUser.Email,
            Role = newUser.Role,
            IsActive = newUser.IsActive,
            CreatedAtUtc = newUser.CreatedAtUtc,
            LastLoginUtc = newUser.LastLoginUtc
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] AdminUserUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var trimmedUsername = dto.Username.Trim();
        var trimmedEmail = dto.Email.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.Id != id && u.Username.ToLower() == trimmedUsername.ToLower()))
        {
            return BadRequest(new { message = "Username already taken by another account." });
        }

        if (await _context.Users.AnyAsync(u => u.Id != id && u.Email.ToLower() == trimmedEmail))
        {
            return BadRequest(new { message = "Email already registered to another account." });
        }

        user.Username = trimmedUsername;
        user.Email = trimmedEmail;
        user.Role = string.IsNullOrWhiteSpace(dto.Role) ? "Admin" : dto.Role.Trim();
        user.IsActive = dto.IsActive;

        // If new password provided, hash and update
        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            if (dto.NewPassword.Length < 8)
            {
                return BadRequest(new { message = "New password must be at least 8 characters long." });
            }
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        }

        _context.AuditLogs.Add(new AuditLog
        {
            Username = User.Identity?.Name ?? "Admin",
            Action = "UpdateUser",
            EntityName = "User",
            EntityId = user.Id.ToString(),
            Details = $"Updated admin user account: {user.Username}"
        });

        await _context.SaveChangesAsync();

        return Ok(new AdminUserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAtUtc = user.CreatedAtUtc,
            LastLoginUtc = user.LastLoginUtc
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var currentUserIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (Guid.TryParse(currentUserIdClaim, out var currentUserId) && currentUserId == id)
        {
            return BadRequest(new { message = "You cannot delete your own account while logged in." });
        }

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        var totalAdmins = await _context.Users.CountAsync();
        if (totalAdmins <= 1)
        {
            return BadRequest(new { message = "Cannot delete the only existing administrator account." });
        }

        _context.Users.Remove(user);

        _context.AuditLogs.Add(new AuditLog
        {
            Username = User.Identity?.Name ?? "Admin",
            Action = "DeleteUser",
            EntityName = "User",
            EntityId = id.ToString(),
            Details = $"Deleted admin user: {user.Username}"
        });

        await _context.SaveChangesAsync();

        return Ok(new { message = "Admin user deleted successfully." });
    }
}

