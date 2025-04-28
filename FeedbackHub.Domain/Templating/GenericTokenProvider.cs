using FeedbackHub.Domain.Services.Interface;

namespace FeedbackHub.Domain.Templating
{
    public class GenericTokenProvider : ITokenValueProvider
    {
        private readonly IApplicationInfoProvider _applicationInfoProvider;
        public GenericTokenProvider(IApplicationInfoProvider applicationInfoProvider)
        {
            _applicationInfoProvider = applicationInfoProvider;
        }
        public string? TypeCode => null;

        public async Task<Dictionary<string, string>> GetTokensAsync(object context)
        {
            var siteUrl = await _applicationInfoProvider.GetSiteUrl();
            var loginUrl = await _applicationInfoProvider.GetLoginPageUrl();
            return new Dictionary<string, string>
            {
                ["SiteUrl"] = siteUrl,
                ["LoginUrl"] = loginUrl,
            };
        }
    }
}
