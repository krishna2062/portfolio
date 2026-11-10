using System.Security.Claims;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(PortfolioDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == dto.UsernameOrEmail || u.Email == dto.UsernameOrEmail);

        if (user == null || !user.IsActive)
            return Unauthorized(new { message = "Invalid credentials or account is inactive." });

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!isPasswordValid)
            return Unauthorized(new { message = "Invalid credentials." });

        var (accessToken, expiresAtUtc) = _tokenService.GenerateAccessToken(user);
        var rawRefreshToken = _tokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = rawRefreshToken,
            ExpiresUtc = DateTime.UtcNow.AddDays(7),
            CreatedByIp = HttpContext.Connection.RemoteIpAddress?.ToString()
        };

        await _context.RefreshTokens.AddAsync(refreshToken);
        user.LastLoginUtc = DateTime.UtcNow;

        _context.AuditLogs.Add(new AuditLog
        {
            Id = Guid.NewGuid(),
            Username = user.Username,
            Action = "Login",
            EntityName = "User",
            EntityId = user.Id.ToString(),
            Details = $"Logged in from {HttpContext.Connection.RemoteIpAddress}"
        });

        await _context.SaveChangesAsync();

        return Ok(new LoginResponseDto
        {
            Token = accessToken,
            RefreshToken = rawRefreshToken,
            ExpiresAtUtc = expiresAtUtc,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            }
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto dto)
    {
        var tokenRecord = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken);

        if (tokenRecord == null || tokenRecord.IsRevoked || tokenRecord.ExpiresUtc < DateTime.UtcNow)
            return Unauthorized(new { message = "Invalid or expired refresh token." });

        var user = tokenRecord.User;
        if (user == null || !user.IsActive)
            return Unauthorized(new { message = "User not active." });

        // Revoke used refresh token (Token rotation)
        tokenRecord.IsRevoked = true;

        var (newAccessToken, expiresAtUtc) = _tokenService.GenerateAccessToken(user);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        var newRefreshTokenRecord = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = newRefreshToken,
            ExpiresUtc = DateTime.UtcNow.AddDays(7),
            CreatedByIp = HttpContext.Connection.RemoteIpAddress?.ToString()
        };

        await _context.RefreshTokens.AddAsync(newRefreshTokenRecord);
        await _context.SaveChangesAsync();

        return Ok(new LoginResponseDto
        {
            Token = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAtUtc = expiresAtUtc,
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            }
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto? dto)
    {
        if (dto != null && !string.IsNullOrEmpty(dto.RefreshToken))
        {
            var tokenRecord = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == dto.RefreshToken);
            if (tokenRecord != null)
            {
                tokenRecord.IsRevoked = true;
                await _context.SaveChangesAsync();
            }
        }

        return Ok(new { message = "Logged out successfully." });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentAdmin()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return Unauthorized();

        return Ok(new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role
        });
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

        _context.AuditLogs.Add(new AuditLog
        {
            Username = user.Username,
            Action = "ChangePassword",
            EntityName = "User",
            EntityId = user.Id.ToString(),
            Details = "Password changed successfully"
        });

        await _context.SaveChangesAsync();

        return Ok(new { message = "Password updated successfully." });
    }

    [Authorize]
    [HttpPost("update-account")]
    public async Task<IActionResult> UpdateAccount([FromBody] UpdateAccountDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
            return NotFound();

        var trimmedUsername = dto.Username.Trim();
        var trimmedEmail = dto.Email.Trim().ToLowerInvariant();

        // Check if username is used by another user
        var usernameExists = await _context.Users.AnyAsync(u => u.Id != userId && u.Username.ToLower() == trimmedUsername.ToLower());
        if (usernameExists)
            return BadRequest(new { message = "Username is already in use by another account." });

        // Check if email is used by another user
        var emailExists = await _context.Users.AnyAsync(u => u.Id != userId && u.Email.ToLower() == trimmedEmail);
        if (emailExists)
            return BadRequest(new { message = "Email is already registered by another account." });

        var oldUsername = user.Username;
        user.Username = trimmedUsername;
        user.Email = trimmedEmail;

        _context.AuditLogs.Add(new AuditLog
        {
            Username = user.Username,
            Action = "UpdateAccount",
            EntityName = "User",
            EntityId = user.Id.ToString(),
            Details = $"Updated account profile from username '{oldUsername}' to '{user.Username}'"
        });

        await _context.SaveChangesAsync();

        // Generate updated access token with new username claim
        var (newAccessToken, expiresAtUtc) = _tokenService.GenerateAccessToken(user);

        return Ok(new
        {
            message = "Account updated successfully.",
            token = newAccessToken,
            expiresAtUtc,
            user = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            }
        });
    }
}

