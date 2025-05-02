using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IBaseRepository<Feedback> _repo;
        private readonly ITicketSequenceRepository _ticketSequenceRepo;
        private readonly IAttachmentService _attachmentService;
        public FeedbackService(IBaseRepository<Feedback> repo, ITicketSequenceRepository ticketSequenceRepo, IAttachmentService attachmentService)
        {
            _repo = repo;
            _ticketSequenceRepo = ticketSequenceRepo;
            _attachmentService = attachmentService;
        }

        public async Task SaveAsync(GenericDto<SaveFeedbackDto> dto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var ticketNumber = await _ticketSequenceRepo.GetNewSequenceNumber();

                var entity = new Feedback(dto.LoggedInUserId, dto.Model.FeedbackTypeId, dto.ApplicationId.GetValueOrDefault(), dto.Model.Priority, dto.Model.Title, dto.Model.Description);

                entity.TicketId = ticketNumber;

                await _repo.InsertAsync(entity);

                await _attachmentService.SaveAsync(entity.Id, dto.Model.Attachments);

                tx.Complete();
            }
        }
    }
}
