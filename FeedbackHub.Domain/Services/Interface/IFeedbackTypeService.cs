using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IFeedbackTypeService
    {
        Task<List<FeedbackTypeDto>> GetFeedbackTypesAsync();
    }
}
