using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Logging;
using FeedbackHub.Server.Helpers;
using FeedbackHub.Server.Models;
using FeedbackHub.Server.ViewModels.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Swashbuckle.AspNetCore.Annotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FeedbackHub.Server.Endpoints.Account
{
    public class LoginEndpoint : EndpointBaseAsync.WithRequest<LoginRequestViewModel>.WithResult<IActionResult>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly JwtSettings _jwtSettings;

        public LoginEndpoint(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,   IOptions<JwtSettings> jwtSettings, RoleManager<ApplicationRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtSettings = jwtSettings.Value;
            _roleManager = roleManager;
        }


        [HttpPost("/account/login")]
        [SwaggerOperation(
        Summary = "Sign in",
        Description = "Sign in ",
        OperationId = "Account_Login",
        Tags = new[] { "LoginEndpoint" })
        ]

        public override async Task<IActionResult> HandleAsync(LoginRequestViewModel request, CancellationToken cancellationToken = default)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    ApplicationUser user = await _userManager.FindByEmailAsync(request.Username) ?? throw new ItemNotFoundException("Email is invalid.");


                    if (await _userManager.CheckPasswordAsync(user, request.Password) == false)
                    {
                        return ApiResponse.Error("Username/password is incorrect.");
                    }

                    var token = await GenerateJwtToken(user);
                    var refreshToken = GenerateRefreshToken();

                    await SaveRefreshTokenAsync(user, refreshToken); // Save in AspNetUserTokens

                    return ApiResponse.Success(new
                    {
                        Token = token,
                        RefreshToken = refreshToken
                    });
                }
            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to login", ex);
            }
            return ApiResponse.Error("Failed to Login");
        }
        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)); // Generates a secure random string
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), 
                new Claim("role", (await _userManager.GetRolesAsync(user)).First()), 
            };

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.TokenExpiryMinutes), 
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task SaveRefreshTokenAsync(ApplicationUser user, string refreshToken)
        {
            await _userManager.SetAuthenticationTokenAsync(user, "JWT", "RefreshToken", refreshToken);
        }

        private async Task<string> GetRefreshTokenAsync(ApplicationUser user)
        {
            return await _userManager.GetAuthenticationTokenAsync(user, "JWT", "RefreshToken");
        }

        private async Task RemoveRefreshTokenAsync(ApplicationUser user)
        {
            await _userManager.RemoveAuthenticationTokenAsync(user, "JWT", "RefreshToken");
        }

    }
}
