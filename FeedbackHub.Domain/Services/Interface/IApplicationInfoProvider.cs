namespace FeedbackHub.Domain.Services.Interface
{
    public interface IApplicationInfoProvider
    {
        Task<string> GetSiteUrl();
    }
}
