using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IUserService
    {
        UserDetailDto GetUserDetailByEmail(string email);
    }
}
