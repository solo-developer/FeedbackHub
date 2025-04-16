namespace FeedbackHub.Domain.Templating
{
    public interface ITokenValueProvider
    {
        string? TypeCode { get; }
        Task<Dictionary<string, string>> GetTokensAsync(object context);
    }

}
