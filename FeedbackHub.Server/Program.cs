using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Helpers;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Domain.Templating;
using FeedbackHub.Infrastructure.Context;
using FeedbackHub.Infrastructure.Repository.Implementations;
using FeedbackHub.Logging;
using FeedbackHub.Server.DataSeeder;
using FeedbackHub.Server.Models;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

namespace FeedbackHub.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
    
            builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
            builder.Services.Configure<DefaultUserCredentials>(builder.Configuration.GetSection("DefaultLoginCredentials"));

            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("FeedbackHubSqlServerConnection"), b => b.MigrationsAssembly("FeedbackHub.Infrastructure"));
                // options.ConfigureWarnings(x => x.Ignore(RelationalEventId.AmbientTransactionWarning));
            });
         

            builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options => options.SignIn.RequireConfirmedAccount = false)
            .AddEntityFrameworkStores<AppDbContext>();

            RegisterServices(builder.Services);
            // Add services to the container.
            builder.Services.AddAuthorization();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen();
            builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
           .AddJwtBearer(options =>
           {
               var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

               options.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateIssuer = true,
                   ValidateAudience = true,
                   ValidateLifetime = true,
                   ValidateIssuerSigningKey = true,
                   ValidIssuer = jwtSettings.Issuer,
                   ValidAudience = jwtSettings.Audience,
                   IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
                   ClockSkew = TimeSpan.Zero // To detect exact expiry
               };

               options.Events = new JwtBearerEvents
               {
                   OnAuthenticationFailed = context =>
                   {
                       if (context.Exception is SecurityTokenExpiredException)
                       {
                           // Add header to let frontend know to refresh token
                           context.Response.Headers.Add("Token-Expired", "true");
                       }

                       return Task.CompletedTask;
                   },

                   OnChallenge = context =>
                   {
                       context.HandleResponse();

                       var isExpired = context.Response.Headers.ContainsKey("Token-Expired");

                       context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                       context.Response.ContentType = "application/json";

                       var errorResponse = isExpired
                           ? "{\"error\":\"Token expired\"}"
                           : "{\"error\":\"Unauthorized\"}";

                       return context.Response.WriteAsync(errorResponse);
                   },

                   OnForbidden = context =>
                   {
                       context.Response.StatusCode = StatusCodes.Status403Forbidden;
                       context.Response.ContentType = "application/json";
                       return context.Response.WriteAsync("{\"error\":\"Forbidden\"}");
                   }
               };
           });

            // Load configuration from appsettings.json
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            // Configure Serilog using the shared library
            SerilogLogger.ConfigureLogger(configuration);
            builder.Host.UseSerilog(SerilogLogger.Logger);

            builder.Services.AddSingleton(serviceProvider =>
            {
                var configuration = serviceProvider.GetRequiredService<IConfiguration>();
                var encryptionSettings = configuration.GetSection("EncryptionSettings");

                string key = encryptionSettings.GetValue<string>("Key")!;
                string iv = encryptionSettings.GetValue<string>("IV")!;

                return new AESEncryptionHelper(key, iv); 
            });

            var app = builder.Build();
            var supportedCultures = new[] { "en-US", "fr-FR", "de-DE" };
            var options = new RequestLocalizationOptions()
                .SetDefaultCulture("en-US")
                .AddSupportedCultures(supportedCultures)
                .AddSupportedUICultures(supportedCultures);

            app.UseRequestLocalization(options);
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseCors("AllowReactApp");
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

           
            app.MapControllers();  // This maps the API endpoints
            app.MapFallbackToFile("/index.html");

            var defaultUserCredentials = app.Services.GetRequiredService<IOptions<DefaultUserCredentials>>();
            var webHostEnv = app.Services.GetRequiredService<IWebHostEnvironment>();
            var seeder = new ApplicationDataSeeder(defaultUserCredentials,webHostEnv);
            await seeder.SeedAsync(app.Services);
            app.Run();
        }
        static void RegisterServices(IServiceCollection services)
        {
            services.Scan(scan => scan
                     .FromAssembliesOf(typeof(IBaseRepository<>), typeof(BaseRepository<>))
                     .AddClasses()
                     .AsSelf()
                      .AsImplementedInterfaces()
                     .WithScopedLifetime());

            //services.AddScoped<ITokenValueProvider, GenericTokenProvider>();
            //services.AddScoped<ITokenValueProvider, RegistrationRequestApprovedTokenProvider>();
            services.AddScoped<TokenProviderResolver>();
            services.AddScoped<IApplicationInfoProvider,ApplicationInfoProvider>();
        }
    }
}
