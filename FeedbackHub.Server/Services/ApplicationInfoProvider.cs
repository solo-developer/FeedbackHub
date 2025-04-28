using FeedbackHub.Domain.Services.Interface;

namespace FeedbackHub.Server.Services
{
    public class ApplicationInfoProvider : IApplicationInfoProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ApplicationInfoProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> GetLoginPageUrl()
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            if (request == null) return string.Empty;

            return $"{request.Scheme}://{request.Host}/login";
        }

        public async Task<string> GetSiteUrl()
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            if (request == null) return string.Empty;

            return $"{request.Scheme}://{request.Host}";
        }
    }
}
