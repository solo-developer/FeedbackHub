using System.Security.Claims;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace FeedbackHub.Server.Services
{
    public class UserContext : IUserContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUserService _userService;

        public UserContext(IHttpContextAccessor httpContextAccessor, UserManager<ApplicationUser> userManager, IUserService userService)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
            _userService = userService;
        }

        public int? UserId
        {
            get
            {
                var userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return null;
                return Convert.ToInt32(userId);
            }
        }

        public async Task<bool> IsAdminUser()
        {

            var aspUserId = await _userService.GetAspUserByUserDetailId(this.UserId.GetValueOrDefault());
            var aspUser = await _userManager.FindByIdAsync(aspUserId.ToString());

            return await _userManager.IsInRoleAsync(aspUser, Constants.ADMIN_ROLE);

        }

        public int? ClientId
        {
            get
            {
                var clientId = _httpContextAccessor.HttpContext?.User?.FindFirst("ClientId")?.Value;
                if (clientId == null) return null;
                return Convert.ToInt32(clientId);
            }
        }

        public int? ApplicationId
        {
            get
            {
                var headers = _httpContextAccessor.HttpContext?.Request?.Headers;
                if (headers == null || !headers.TryGetValue("ApplicationId", out var applicationIdValue))
                    return null;

                return int.TryParse(applicationIdValue, out var appId) ? appId : null;
            }
        }


        public string? Email => _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Email)?.Value;

        public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value;
    }

}
