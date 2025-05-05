using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Dto.User;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IUserService
    {
        Task<PaginatedDataResponseDto<UserDetailDto>> GetAllUsersAsync(UserFilterDto dto);
        Task<UserDetailDto> GetUserDetailByAspUserIdAsync(int aspUserId);

        Task<int> GetAspUserByUserDetailId(int userDetailId);

        Task<List<ApplicationDto>> GetSubscriptionsOfUser(int userId);

        Task DeleteAsync(int id);
        Task UndoDeleteAsync(int id);
        Task ResetPasswordAsync(int userId);

        Task CreateAdminUserAsync(CreateUserDto dto);
    }
}
