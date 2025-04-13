using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IApplicationService
    {
        Task<List<ApplicationDto>> GetAllAsync();

        Task SaveAsync(ApplicationDto dto);
    }
}
