using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Dto.Feedback;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IFeedbackService
    {
        Task SaveAsync(GenericDto<SaveFeedbackDto> dto);

        Task<PaginatedDataResponseDto<FeedbackBasicDetailDto>> GetAsync<TFilterDto>(GenericDto<TFilterDto> request) where TFilterDto: FeedbackFilterDto;
    }
}
