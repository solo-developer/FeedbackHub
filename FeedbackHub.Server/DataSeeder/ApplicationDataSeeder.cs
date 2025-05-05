using FeedbackHub.Domain.Entities;
using FeedbackHub.Infrastructure.Context;
using Microsoft.AspNetCore.Identity;
using System.Net;
using System.Reflection;
using System.Security.Claims;
using System.Security;
using FeedbackHub.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using FeedbackHub.Server.Models;
using Serilog;

namespace FeedbackHub.Server.DataSeeder
{
    public class ApplicationDataSeeder
    {
        private readonly DefaultUserCredentials _defaultUserCredentials;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ApplicationDataSeeder(IOptions<DefaultUserCredentials> options, IWebHostEnvironment webHostEnvironment)
        {
            _defaultUserCredentials = options.Value;
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            context.Database.Migrate();

            await SeedRoles(roleManager);
            await SeedUsers(userManager,context);

            await SeedEmailTemplates(context);

        }

        private async Task SeedEmailTemplates(AppDbContext context)
        {
            await AddEmailTemplateIfNotExists(context, Domain.Enums.TemplateType.RegistrationRequestAccepted, "Registration request approved", "ApprovalOfRegistrationRequest.html");

            await AddEmailTemplateIfNotExists(context, Domain.Enums.TemplateType.PasswordReset, "Password Reset", "PasswordReset.html");

            await AddEmailTemplateIfNotExists(context, Domain.Enums.TemplateType.AccountCreated, "Account Created", "AccountCreated.html");

        }
        private async Task AddEmailTemplateIfNotExists(AppDbContext context, Domain.Enums.TemplateType templateType, string subject, string templateFileName)
        {
            var existingTemplate = await context.Templates.SingleOrDefaultAsync(a => a.TemplateType == templateType);
            if (existingTemplate is not null)
                return;

            var filePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Templates", templateFileName);

            if (!File.Exists(filePath))
            {
                Log.Error($"{templateFileName} is not present in Templates folder");
                return;
            }

            var templateContent = await File.ReadAllTextAsync(filePath);

            context.Templates.Add(new Template
            {
                Subject = subject,
                EmailTemplate = templateContent,
                TemplateType = templateType
            });

            await context.SaveChangesAsync();
        }

        private async Task SeedUsers(UserManager<ApplicationUser> userManager, AppDbContext context)
        {
            if (await userManager.FindByEmailAsync(_defaultUserCredentials.Email) == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = _defaultUserCredentials.Username,
                    Email = _defaultUserCredentials.Email,
                    EmailConfirmed = true
                };
                await userManager.CreateAsync(adminUser, _defaultUserCredentials.Password);
                await userManager.AddToRoleAsync(adminUser, Constants.ADMIN_ROLE);

                context.UserDetails.Add(new UserDetail
                {
                    AppUserId= adminUser.Id,
                    FullName="Contact User",

                });

                await context.SaveChangesAsync();
                
            }
        }

        private static async Task SeedRoles(RoleManager<ApplicationRole> roleManager)
        {
            string[] roles = { Constants.ADMIN_ROLE, Constants.CLIENT_ROLE };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new ApplicationRole() { Name = role, NormalizedName = role.ToUpper() });
                }
            }
        }
    }
}
