using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();
    public DbSet<TelemetryBadge> TelemetryBadges => Set<TelemetryBadge>();
    public DbSet<AboutSection> AboutSections => Set<AboutSection>();
    public DbSet<AboutTab> AboutTabs => Set<AboutTab>();
    public DbSet<SkillCategory> SkillCategories => Set<SkillCategory>();
    public DbSet<SkillItem> SkillItems => Set<SkillItem>();
    public DbSet<EducationRecord> EducationRecords => Set<EducationRecord>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectTechnology> ProjectTechnologies => Set<ProjectTechnology>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<BlogCategory> BlogCategories => Set<BlogCategory>();
    public DbSet<BlogTag> BlogTags => Set<BlogTag>();
    public DbSet<BlogTagMapping> BlogTagMappings => Set<BlogTagMapping>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<WebsiteSetting> WebsiteSettings => Set<WebsiteSetting>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Project slug index
        modelBuilder.Entity<Project>()
            .HasIndex(p => p.Slug)
            .IsUnique();

        // Blog post slug index
        modelBuilder.Entity<BlogPost>()
            .HasIndex(b => b.Slug)
            .IsUnique();

        // BlogTagMapping composite PK
        modelBuilder.Entity<BlogTagMapping>()
            .HasKey(btm => new { btm.BlogPostId, btm.BlogTagId });

        modelBuilder.Entity<BlogTagMapping>()
            .HasOne(btm => btm.BlogPost)
            .WithMany(p => p.TagMappings)
            .HasForeignKey(btm => btm.BlogPostId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BlogTagMapping>()
            .HasOne(btm => btm.BlogTag)
            .WithMany(t => t.TagMappings)
            .HasForeignKey(btm => btm.BlogTagId)
            .OnDelete(DeleteBehavior.Cascade);

        // Cascade deletes for children
        modelBuilder.Entity<Project>()
            .HasMany(p => p.Technologies)
            .WithOne(t => t.Project)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Profile>()
            .HasMany(p => p.SocialLinks)
            .WithOne(s => s.Profile)
            .HasForeignKey(s => s.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Profile>()
            .HasMany(p => p.TelemetryBadges)
            .WithOne(t => t.Profile)
            .HasForeignKey(t => t.ProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AboutSection>()
            .HasMany(a => a.Tabs)
            .WithOne(t => t.AboutSection)
            .HasForeignKey(t => t.AboutSectionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SkillCategory>()
            .HasMany(c => c.Items)
            .WithOne(i => i.SkillCategory)
            .HasForeignKey(i => i.SkillCategoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

