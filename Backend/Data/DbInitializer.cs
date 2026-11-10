using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(PortfolioDbContext context, IConfiguration configuration)
    {
        await context.Database.MigrateAsync();

        // 1. Seed Owner Admin User if missing
        if (!await context.Users.AnyAsync())
        {
            var defaultUsername = configuration["AdminUser:Username"] ?? "krishna";
            var defaultEmail = configuration["AdminUser:Email"] ?? "krishnabhandari2062@gmail.com";
            var defaultPassword = configuration["AdminUser:DefaultPassword"] ?? "Admin@Krishna2026!";
            
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(defaultPassword);

            var ownerUser = new User
            {
                Username = defaultUsername,
                Email = defaultEmail,
                PasswordHash = passwordHash,
                Role = "Owner",
                IsActive = true,
                CreatedAtUtc = DateTime.UtcNow
            };

            await context.Users.AddAsync(ownerUser);
            await context.SaveChangesAsync();
        }

        // 2. Seed Profile
        if (!await context.Profiles.AnyAsync())
        {
            var profile = new Profile
            {
                FullName = "Krishna Prasad Bhandari",
                BrandTitle = "Krishna.",
                HeroTitleLine1 = "Full Stack Developer",
                HeroTitleLine2 = "& Computer Engineering",
                HeroHighlight = "Student",
                Subtitle = "Specializing in high-performance web applications, robust ASP.NET Core backend architecture, modern React interfaces, and hardware telemetry.",
                ProfileImageUrl = "/assets/krishna.png",
                CvDownloadUrl = null,
                Location = "Butwal, Lumbini Province, Nepal",
                PhoneWhatsApp = "+977 9867165211",
                ContactEmail = "krishnabhandari2062@gmail.com",
                DomainEmail = "contact@krishnabhandari01.com.np",
                UpdatedAtUtc = DateTime.UtcNow
            };

            await context.Profiles.AddAsync(profile);
            await context.SaveChangesAsync();

            // Seed Social Links
            var socialLinks = new List<SocialLink>
            {
                new() { ProfileId = profile.Id, Name = "Github", Link = "https://github.com/krishna2062", IconKey = "RiGithubLine", DisplayOrder = 1, IsActive = true },
                new() { ProfileId = profile.Id, Name = "LinkedIn", Link = "https://www.linkedin.com/in/krishna-bhandari-8b0273333", IconKey = "RiLinkedinLine", DisplayOrder = 2, IsActive = true },
                new() { ProfileId = profile.Id, Name = "Website", Link = "https://www.krishnabhandari01.com.np", IconKey = "RiGlobalLine", DisplayOrder = 3, IsActive = true },
                new() { ProfileId = profile.Id, Name = "Contact", Link = "mailto:contact@krishnabhandari01.com.np", IconKey = "RiMailLine", DisplayOrder = 4, IsActive = true },
                new() { ProfileId = profile.Id, Name = "WhatsApp", Link = "https://wa.me/9779867165211", IconKey = "HiPhone", DisplayOrder = 5, IsActive = true },
            };
            await context.SocialLinks.AddRangeAsync(socialLinks);

            // Seed Telemetry Badges
            var badges = new List<TelemetryBadge>
            {
                new() { ProfileId = profile.Id, BadgeKey = "telemetry_func", ContentJson = "{\"prefix\":\"async\",\"label\":\"function fetchTelemetry()...\"}", DisplayOrder = 1, IsActive = true },
                new() { ProfileId = profile.Id, BadgeKey = "sensor_data", ContentJson = "{\"label\":\"IoT Sensor Data\"}", DisplayOrder = 2, IsActive = true },
                new() { ProfileId = profile.Id, BadgeKey = "journey", ContentJson = "{\"title\":\"</> Developer Journey\",\"tagline\":\"Try → Fail → Learn → Build → Repeat\",\"quote\":\"Failed yesterday. Better today.\"}", DisplayOrder = 3, IsActive = true },
                new() { ProfileId = profile.Id, BadgeKey = "developer_obj", ContentJson = "{\"const\":\"developer\",\"props\":{\"learn\":true,\"fail\":true,\"improve\":true}}", DisplayOrder = 4, IsActive = true },
                new() { ProfileId = profile.Id, BadgeKey = "build_activity", ContentJson = "{\"command\":\"> npm run build\",\"status\":\"✓ compiled successfully\",\"next\":\"→ pushing next update...\"}", DisplayOrder = 5, IsActive = true }
            };
            await context.TelemetryBadges.AddRangeAsync(badges);
            await context.SaveChangesAsync();
        }

        // 3. Seed About Section & Tabs
        if (!await context.AboutSections.AnyAsync())
        {
            var about = new AboutSection
            {
                Headline = "Passionate software",
                HeadlineAccent = "engineer based in Nepal.",
                Description = "Focused on building scalable enterprise solutions, performant REST APIs, clean database designs, and hardware-software telemetry integrations.",
                ImageUrl = "/assets/krishna.png",
                YearsOfExperience = 2,
                CompletedProjects = 10,
                TechMasteredCount = 8,
                UpdatedAtUtc = DateTime.UtcNow
            };

            await context.AboutSections.AddAsync(about);
            await context.SaveChangesAsync();

            var tabs = new List<AboutTab>
            {
                new()
                {
                    AboutSectionId = about.Id,
                    TabKey = "experience",
                    Title = "Backend Developer & Tech Lead — NeoVertex Solution",
                    Subtitle = "Primary Tech: C#, ASP.NET Core, SQL Server, EF Core",
                    Description = "Designing scalable APIs, authentication layers, and enterprise services.",
                    DisplayOrder = 1,
                    IsActive = true
                },
                new()
                {
                    AboutSectionId = about.Id,
                    TabKey = "status",
                    Title = "BE in Computer Engineering (4th Semester)",
                    Subtitle = "Lumbini Engineering College (Pokhara University)",
                    Description = "Focusing on Operating Systems, Database Architecture, and Embedded IoT.",
                    DisplayOrder = 2,
                    IsActive = true
                }
            };

            await context.AboutTabs.AddRangeAsync(tabs);
            await context.SaveChangesAsync();
        }

        // 4. Seed Skills
        if (!await context.SkillCategories.AnyAsync())
        {
            var categories = new List<SkillCategory>
            {
                new()
                {
                    Category = "Frontend",
                    DisplayOrder = 1,
                    IsActive = true,
                    Items = new List<SkillItem>
                    {
                        new() { Name = "React.js", DisplayOrder = 1 },
                        new() { Name = "Next.js", DisplayOrder = 2 },
                        new() { Name = "HTML5", DisplayOrder = 3 },
                        new() { Name = "CSS3", DisplayOrder = 4 },
                        new() { Name = "JavaScript (ES6+)", DisplayOrder = 5 },
                        new() { Name = "Tailwind CSS", DisplayOrder = 6 },
                        new() { Name = "Framer Motion", DisplayOrder = 7 }
                    }
                },
                new()
                {
                    Category = "Backend",
                    DisplayOrder = 2,
                    IsActive = true,
                    Items = new List<SkillItem>
                    {
                        new() { Name = "C#", DisplayOrder = 1 },
                        new() { Name = "ASP.NET Core", DisplayOrder = 2 },
                        new() { Name = "ASP.NET Web API", DisplayOrder = 3 },
                        new() { Name = "Node.js", DisplayOrder = 4 },
                        new() { Name = "Express.js", DisplayOrder = 5 },
                        new() { Name = "Django", DisplayOrder = 6 },
                        new() { Name = "FastAPI", DisplayOrder = 7 }
                    }
                },
                new()
                {
                    Category = "Databases",
                    DisplayOrder = 3,
                    IsActive = true,
                    Items = new List<SkillItem>
                    {
                        new() { Name = "SQL Server", DisplayOrder = 1 },
                        new() { Name = "PostgreSQL", DisplayOrder = 2 },
                        new() { Name = "MongoDB", DisplayOrder = 3 },
                        new() { Name = "SQLite", DisplayOrder = 4 },
                        new() { Name = "Firebase Firestore", DisplayOrder = 5 }
                    }
                },
                new()
                {
                    Category = "Languages",
                    DisplayOrder = 4,
                    IsActive = true,
                    Items = new List<SkillItem>
                    {
                        new() { Name = "C", DisplayOrder = 1 },
                        new() { Name = "C++", DisplayOrder = 2 },
                        new() { Name = "C#", DisplayOrder = 3 },
                        new() { Name = "Python", DisplayOrder = 4 },
                        new() { Name = "JavaScript", DisplayOrder = 5 },
                        new() { Name = "TypeScript", DisplayOrder = 6 },
                        new() { Name = "Java", DisplayOrder = 7 }
                    }
                },
                new()
                {
                    Category = "Tools & DevOps",
                    DisplayOrder = 5,
                    IsActive = true,
                    Items = new List<SkillItem>
                    {
                        new() { Name = "Git", DisplayOrder = 1 },
                        new() { Name = "GitHub", DisplayOrder = 2 },
                        new() { Name = "Visual Studio", DisplayOrder = 3 },
                        new() { Name = "VS Code", DisplayOrder = 4 },
                        new() { Name = "Postman", DisplayOrder = 5 },
                        new() { Name = "Docker", DisplayOrder = 6 },
                        new() { Name = "Kali Linux", DisplayOrder = 7 }
                    }
                },
                new()
                {
                    Category = "Core Domains",
                    DisplayOrder = 6,
                    IsActive = true,
                    Items = new List<SkillItem>
                    {
                        new() { Name = "RESTful System Architecture", DisplayOrder = 1 },
                        new() { Name = "WebSockets", DisplayOrder = 2 },
                        new() { Name = "IoT Telemetry", DisplayOrder = 3 },
                        new() { Name = "Computer Vision (OpenCV)", DisplayOrder = 4 }
                    }
                }
            };

            await context.SkillCategories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // 5. Seed Education
        if (!await context.EducationRecords.AnyAsync())
        {
            var education = new List<EducationRecord>
            {
                new()
                {
                    Degree = "Bachelor of Engineering in Computer Engineering (BE Computer)",
                    Institution = "Lumbini Engineering College (Pokhara University)",
                    Status = "4th Semester Enrolled",
                    DisplayOrder = 1,
                    IsPublished = true
                },
                new()
                {
                    Degree = "Higher Secondary Education (IT Engineering)",
                    Institution = "Higher Secondary Board",
                    Status = "Academic Score: GPA 3.36 (Graduated)",
                    DisplayOrder = 2,
                    IsPublished = true
                },
                new()
                {
                    Degree = "Secondary Education Examination (SEE - IT Engineering)",
                    Institution = "National Examination Board",
                    Status = "Academic Score: GPA 3.28 (Graduated)",
                    DisplayOrder = 3,
                    IsPublished = true
                }
            };

            await context.EducationRecords.AddRangeAsync(education);
            await context.SaveChangesAsync();
        }

        // 6. Seed Services
        if (!await context.Services.AnyAsync())
        {
            var services = new List<Service>
            {
                new()
                {
                    Title = "Web Development",
                    Description = "Modern, responsive, and high-performance websites built to represent your business professionally and provide a smooth experience across desktop and mobile devices.",
                    IconKey = "RxDesktop",
                    DisplayOrder = 1,
                    IsPublished = true
                },
                new()
                {
                    Title = "Backend Development",
                    Description = "Secure and scalable backend systems designed to handle business logic, data processing, authentication, APIs, and real-world application requirements.",
                    IconKey = "RxRocket",
                    DisplayOrder = 2,
                    IsPublished = true
                },
                new()
                {
                    Title = "Full-Stack Development",
                    Description = "Complete web applications built from frontend to backend, connecting intuitive user interfaces with reliable APIs and database systems.",
                    IconKey = "RxCrop",
                    DisplayOrder = 3,
                    IsPublished = true
                },
                new()
                {
                    Title = "Custom Software Development",
                    Description = "Business-specific software solutions designed around real workflows, helping organizations reduce manual work and manage their operations more efficiently.",
                    IconKey = "RxPencil2",
                    DisplayOrder = 4,
                    IsPublished = true
                },
                new()
                {
                    Title = "Database Solutions",
                    Description = "Well-structured and reliable database solutions for applications that require secure data storage, efficient queries, relationships, and scalable data management.",
                    IconKey = "RxReader",
                    DisplayOrder = 5,
                    IsPublished = true
                },
                new()
                {
                    Title = "API Development & Integration",
                    Description = "Clean and reliable APIs that allow applications, services, and platforms to communicate securely and efficiently.",
                    IconKey = "RxCode",
                    DisplayOrder = 6,
                    IsPublished = true
                }
            };

            await context.Services.AddRangeAsync(services);
            await context.SaveChangesAsync();
        }

        // 7. Seed Projects
        if (!await context.Projects.AnyAsync())
        {
            var projects = new List<Project>
            {
                new()
                {
                    Title = "Hamro Kirana",
                    Slug = "hamro-kirana",
                    Path = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
                    Link = "https://krishnabhandari01.com.np",
                    Description = "Nepal-focused local quick-commerce platform connecting buyers and local sellers with real-time cart, checkout, inventory management, and ASP.NET Core Web API architecture.",
                    DisplayOrder = 1,
                    IsFeatured = true,
                    IsPublished = true,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "React" },
                        new() { Name = "C#" },
                        new() { Name = "ASP.NET Core Web API" },
                        new() { Name = "SQL Server" },
                        new() { Name = "EF Core" }
                    }
                },
                new()
                {
                    Title = "SkillNepal",
                    Slug = "skill-nepal",
                    Path = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
                    Link = "https://krishnabhandari01.com.np",
                    Description = "Digital education and skill platform focused on connecting learners with hands-on technical roadmaps, learning resources, and career opportunities.",
                    DisplayOrder = 2,
                    IsFeatured = true,
                    IsPublished = true,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "React.js" },
                        new() { Name = "Node.js" },
                        new() { Name = "Express.js" },
                        new() { Name = "MongoDB" }
                    }
                },
                new()
                {
                    Title = "Together",
                    Slug = "together",
                    Path = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
                    Link = "https://krishnabhandari01.com.np",
                    Description = "Interactive social networking platform concept featuring real-time feed updates, user interactions, messaging channels, and reactive state management.",
                    DisplayOrder = 3,
                    IsFeatured = true,
                    IsPublished = true,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "React.js" },
                        new() { Name = "Firebase" },
                        new() { Name = "Firestore" }
                    }
                },
                new()
                {
                    Title = "IoT Air Purification",
                    Slug = "iot-air-purification",
                    Path = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
                    Link = "https://krishnabhandari01.com.np",
                    Description = "Live environmental dashboard streaming air quality indices (AQI), automatic purification thresholds, and instant fire/hazard alert triggers via WebSockets.",
                    DisplayOrder = 4,
                    IsFeatured = true,
                    IsPublished = true,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "React.js" },
                        new() { Name = "Python" },
                        new() { Name = "FastAPI" },
                        new() { Name = "WebSockets" },
                        new() { Name = "SQLite" }
                    }
                },
                new()
                {
                    Title = "Smart Face Attendance",
                    Slug = "smart-face-attendance",
                    Path = "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
                    Link = "https://krishnabhandari01.com.np",
                    Description = "Automated facial recognition attendance logger tailored for schools and offices with high-accuracy identity verification and exportable logs.",
                    DisplayOrder = 5,
                    IsFeatured = true,
                    IsPublished = true,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "Python" },
                        new() { Name = "OpenCV" },
                        new() { Name = "FastAPI" },
                        new() { Name = "React.js" },
                        new() { Name = "SQLite" }
                    }
                },
                new()
                {
                    Title = "IoT GPS Bus Tracking",
                    Slug = "iot-gps-bus-tracking",
                    Path = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
                    Link = "https://krishnabhandari01.com.np",
                    Description = "Real-time public transit tracking system featuring live map coordinate plotting, route ETA prediction, and active vehicle telemetry.",
                    DisplayOrder = 6,
                    IsFeatured = true,
                    IsPublished = true,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "React.js" },
                        new() { Name = "Leaflet" },
                        new() { Name = "Node.js" },
                        new() { Name = "WebSockets" }
                    }
                },
                new()
                {
                    Title = "Django E-Commerce API",
                    Slug = "django-ecommerce-api",
                    Path = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
                    Link = "https://krishnabhandari01.com.np",
                    Description = "Multi-vendor store backend with async job processing (Celery), custom JWT authentication pipelines, and flexible document catalog storage.",
                    DisplayOrder = 7,
                    IsFeatured = true,
                    IsPublished = true,
                    Technologies = new List<ProjectTechnology>
                    {
                        new() { Name = "Python" },
                        new() { Name = "Django REST" },
                        new() { Name = "MongoDB" },
                        new() { Name = "Celery" }
                    }
                }
            };

            await context.Projects.AddRangeAsync(projects);
            await context.SaveChangesAsync();
        }

        // 8. Seed Default Website Settings
        if (!await context.WebsiteSettings.AnyAsync())
        {
            var settings = new List<WebsiteSetting>
            {
                new() { Key = "SiteTitle", Value = "Krishna Portfolio | Full Stack Developer", Description = "Default HTML Title" },
                new() { Key = "SiteDescription", Value = "Personal portfolio of Krishna - Full Stack Developer & Computer Engineering Student", Description = "Meta Description" },
                new() { Key = "GoogleAnalyticsId", Value = "G-RE7ER17RWK", Description = "Google Analytics Measurement ID" },
                new() { Key = "ThemeColor", Value = "#f13024", Description = "Accent Theme Color" }
            };

            await context.WebsiteSettings.AddRangeAsync(settings);
            await context.SaveChangesAsync();
        }
    }
}

