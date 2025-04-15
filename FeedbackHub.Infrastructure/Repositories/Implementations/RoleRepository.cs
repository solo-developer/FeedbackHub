using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.Repositories.Implementations
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AppDbContext _context;

        public RoleRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int?> GetRoleIdByNameAsync(string roleName)
        {
            return await _context.Roles
                .Where(r => r.Name == roleName)
                .Select(r => r.Id)
                .FirstOrDefaultAsync();
        }
    }

}
