namespace FeedbackHub.Domain.Templating
{
    public class TokenProviderResolver
    {
        private readonly IEnumerable<ITokenValueProvider> _providers;

        public TokenProviderResolver(IEnumerable<ITokenValueProvider> providers)
        {
            _providers = providers;
        }

        public async Task<Dictionary<string, string>> CollectTokensAsync(string typeCode, object context)
        {
            var applicableProviders = _providers
                .Where(p => p.TypeCode == null || p.TypeCode == typeCode);

            var allTokens = new Dictionary<string, string>();

            foreach (var provider in applicableProviders)
            {
                var tokens = await provider.GetTokensAsync(context);
                foreach (var kvp in tokens)
                {
                    allTokens[kvp.Key] = kvp.Value; 
                }
            }

            return allTokens;
        }

    }

}
