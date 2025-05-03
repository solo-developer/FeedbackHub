namespace FeedbackHub.Server.Services
{
    public interface IUserContext
    {
        int? UserId { get; }
        string? Email { get; }
        string? Role { get; }

        int? ClientId { get; }
        int? ApplicationId { get; }

        Task<bool> IsAdminUser();
    }
}
