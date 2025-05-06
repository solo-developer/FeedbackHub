using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Dto.Feedback;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IBaseRepository<Feedback> _repo;
        private readonly ITicketSequenceRepository _ticketSequenceRepo;
        private readonly IAttachmentService _attachmentService;
        private readonly IBaseRepository<RegistrationRequest> _registrationRequestRepo;
        public FeedbackService(IBaseRepository<Feedback> repo, ITicketSequenceRepository ticketSequenceRepo, IAttachmentService attachmentService, IBaseRepository<RegistrationRequest> registrationRequestRepo)
        {
            _repo = repo;
            _ticketSequenceRepo = ticketSequenceRepo;
            _attachmentService = attachmentService;
            _registrationRequestRepo = registrationRequestRepo;
        }

        public async Task<PaginatedDataResponseDto<FeedbackBasicDetailDto>> GetAsync<TFilterDto>(GenericDto<TFilterDto> request) where TFilterDto : FeedbackFilterDto
        {
            var queryable = _repo.GetQueryable().Where(a => a.ParentFeedbackId == null);

            if (request is GenericDto<FeedbackFilterDto> clientFilter)
            {
                await ValidRequest(clientFilter);

                if (request.ApplicationId > 0)
                {
                    queryable = queryable.Where(a => a.ApplicationId == request.ApplicationId);
                }

                if (request.ClientId > 0)
                {
                    queryable = queryable.Where(a => a.User.RegistrationRequest.ClientId == request.ClientId);
                }
            }
            else
            {
                var adminFilter = request as GenericDto<AdminFeedbackFilterDto>;
                if (adminFilter!.Model.UserId.HasValue)
                {
                    queryable = queryable.Where(a => a.UserId == adminFilter.Model.UserId);
                }

                if (adminFilter.Model.ApplicationId > 0)
                {
                    queryable = queryable.Where(a => a.ApplicationId == adminFilter.Model.ApplicationId);
                }

                if (adminFilter.Model.ClientId > 0)
                {
                    queryable = queryable.Where(a => a.User.RegistrationRequest.ClientId == adminFilter.Model.ClientId);
                }
            }

            if (request.Model.Status.HasValue)
            {
                queryable = queryable.Where(a => a.Status == request.Model.Status);
            }
            if (request.Model.FromDate.HasValue)
            {
                queryable = queryable.Where(a => a.CreatedDate.Date >= request.Model.FromDate.Value.Date);
            }
            if (request.Model.ToDate.HasValue)
            {
                queryable = queryable.Where(a => a.CreatedDate.Date <= request.Model.ToDate.Value.Date);
            }

            var totalCount = await queryable.CountAsync();

            var feedbacks = await queryable.OrderByDescending(a => a.ModifiedDate).Skip(request.Model.Skip).Take(request.Model.Take).Select(a => new FeedbackBasicDetailDto
            {
                Id=a.Id,
                TicketId= a.TicketId,
                Title =a.Title,
                CreatedBy= a.User.FullName,
                CreatedDate= a.CreatedDate,
                FeedbackType = a.FeedbackType.Type,
                Application = a.Application.Name,
                Priority= a.Priority,
                Status= a.Status
            }).ToListAsync();

            return new PaginatedDataResponseDto<FeedbackBasicDetailDto>
            {
                TotalCount = totalCount,
                Data = feedbacks
            };

        }

        private async Task ValidRequest(GenericDto<FeedbackFilterDto> request)
        {
            if (!request.IsAdminUser && request.ApplicationId.GetValueOrDefault() == 0)
                throw new InvalidValueException("You are not authorized to view feedbacks");
            if (request.IsAdminUser)
            {
                var clientRegistrationRequest = await _registrationRequestRepo.FindAsync(a => a.ConvertedUserId == request.LoggedInUserId);
                if (clientRegistrationRequest.ClientId != request.ClientId)
                    throw new InvalidValueException("Mismatch in client detail.");
            }
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
