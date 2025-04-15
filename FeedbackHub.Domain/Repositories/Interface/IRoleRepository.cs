namespace FeedbackHub.Domain.Repositories.Interface
{
    public interface IRoleRepository
    {
        Task<int?> GetRoleIdByNameAsync(string roleName);
    }

}
