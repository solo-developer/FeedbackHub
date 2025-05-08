using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Dto.Feedback;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IFeedbackService
    {
        Task SaveAsync(GenericDto<SaveFeedbackDto> dto);
        Task UpdateAsync(GenericDto<FeedbackUpdateDto> dto);

        Task<PaginatedDataResponseDto<FeedbackBasicDetailDto>> GetAsync<TFilterDto>(GenericDto<TFilterDto> request) where TFilterDto: FeedbackFilterDto;

        Task<FeedbackDetailDto> GetByIdAsync(int id);
    }
}
