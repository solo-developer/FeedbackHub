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

        Task AddCommentAsync(GenericDto<AddFeedbackCommentDto> dto);
        Task<List<BoardFeedbackDto>> GetBoardFeedbacksAsync(GenericDto<BoardFeedbackFilterDto> dto);
        Task<List<BoardFeedbackDto>> GetBoardBacklogsAsync(GenericDto<BoardFeedbackFilterDto> dto);

        Task<List<FeedbackCommentDto>> GetCommentsAsync(int feedbackId);
        Task<List<FeedbackAttachmentDto>> GetAttachmentsAsync(int feedbackId);

        Task AddAttachmentsAsync(GenericDto<SaveFeedbackAttachmentDto> dto);
        Task<List<FeedbackCountResponseDto>> GetFeedbackCountAsync(FeedbackCountFilterDto request);
    }
}
