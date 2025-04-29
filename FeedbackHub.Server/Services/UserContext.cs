using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace FeedbackHub.Server.Services
{
    public class UserContext : IUserContext
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContext(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int? UserId
        {
            get
            {
                var userId= _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return null;
                return Convert.ToInt32(userId);
            }
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

        public string? Email => _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Email)?.Value;

        public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Role)?.Value;
    }

}
