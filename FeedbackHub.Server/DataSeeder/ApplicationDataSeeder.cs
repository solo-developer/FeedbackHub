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

namespace FeedbackHub.Server.DataSeeder
{
    public class ApplicationDataSeeder
    {
        private readonly DefaultUserCredentials _defaultUserCredentials;
        public ApplicationDataSeeder(IOptions<DefaultUserCredentials> options)
        {
            _defaultUserCredentials = options.Value;
        }

        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            context.Database.Migrate();

            string[] roles = { Constants.ADMIN_ROLE, Constants.CLIENT_ROLE };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new ApplicationRole() { Name= role,NormalizedName= role.ToUpper()});
                }
            }

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
            }
        }
    }
}
