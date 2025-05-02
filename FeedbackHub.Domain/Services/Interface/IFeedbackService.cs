using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IFeedbackService
    {
        Task SaveAsync(GenericDto<SaveFeedbackDto> dto);
    }
}
