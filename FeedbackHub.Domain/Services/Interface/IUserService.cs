using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IUserService
    {
        Task<PaginatedDataResponseDto<UserDetailDto>> GetAllUsersAsync(UserFilterDto dto);

        Task DeleteAsync(int id);
        Task UndoDeleteAsync(int id);
        Task ResetPasswordAsync(int userId);
    }
}
