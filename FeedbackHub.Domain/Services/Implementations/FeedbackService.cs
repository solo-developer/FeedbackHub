using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Dto.Feedback;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Helpers;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Domain.Templating;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class FeedbackService : IFeedbackService
    {
        private readonly IBaseRepository<Feedback> _repo;
        private readonly ITicketSequenceRepository _ticketSequenceRepo;
        private readonly IAttachmentService _attachmentService;
        private readonly IBaseRepository<RegistrationRequest> _registrationRequestRepo;
        private readonly IEmailContentComposer _emailContentComposerService;
        private readonly IEmailSenderService _emailSenderService;
        private readonly IUserNotificationService _userNotificationService;
        private readonly IBaseRepository<FeedbacksLink> _feedbacksLinkRepo;

        public FeedbackService(IBaseRepository<Feedback> repo, ITicketSequenceRepository ticketSequenceRepo, IAttachmentService attachmentService, IBaseRepository<RegistrationRequest> registrationRequestRepo, IEmailContentComposer emailContentComposerService, IEmailSenderService emailSenderService, IUserNotificationService userNotificationService, IBaseRepository<FeedbacksLink> feedbacksLinkRepo)
        {
            _repo = repo;
            _ticketSequenceRepo = ticketSequenceRepo;
            _attachmentService = attachmentService;
            _registrationRequestRepo = registrationRequestRepo;
            _emailContentComposerService = emailContentComposerService;
            _emailSenderService = emailSenderService;
            _userNotificationService = userNotificationService;
            _feedbacksLinkRepo = feedbacksLinkRepo;
        }

        public async Task<PaginatedDataResponseDto<FeedbackBasicDetailDto>> GetAsync<TFilterDto>(GenericDto<TFilterDto> request) where TFilterDto : FeedbackFilterDto
        {
            var queryable = _repo.GetQueryable();

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


            if (request.Model.FeedbackTypeId > 0)
            {
                queryable = queryable.Where(a => a.FeedbackTypeId == request.Model.FeedbackTypeId);
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
            if (!string.IsNullOrEmpty(request.Model.Search))
            {
                var normalisedSearch = request.Model.Search.ToLower().Trim();
                queryable = queryable.Where(a => a.TicketId.ToString() == normalisedSearch || a.Title.ToLower().Contains(normalisedSearch));
            }

            var totalCount = await queryable.CountAsync();

            queryable = queryable.OrderByDescending(a => a.ModifiedDate);
            if (!request.Model.IsForExport)
            {
                queryable = queryable.Skip(request.Model.Skip).Take(request.Model.Take);
            }

            var feedbacks = await queryable.Select(MapToFeedbackBasicDetail()).ToListAsync();

            return new PaginatedDataResponseDto<FeedbackBasicDetailDto>
            {
                TotalCount = totalCount,
                Data = feedbacks
            };

        }

        private Expression<Func<Feedback, FeedbackBasicDetailDto>> MapToFeedbackBasicDetail()
        {
            return a => new FeedbackBasicDetailDto
            {
                Id = a.Id,
                TicketId = a.TicketId,
                Title = a.Title,
                CreatedBy = a.User.FullName,
                CreatedDate = a.CreatedDate,
                FeedbackType = a.FeedbackType.Type,
                Client = a.User.RegistrationRequest.Client.Name,
                Application = a.Application.Name,
                Priority = a.Priority,
                Status = a.Status
            };
        }

        private Expression<Func<Feedback, FeedbackDetailDto>> MapToFeedbackDetail()
        {
            return a => new FeedbackDetailDto
            {
                Id = a.Id,
                TicketId = a.TicketId,
                Title = a.Title,
                CreatedBy = a.User.FullName,
                CreatedDate = a.CreatedDate,
                FeedbackTypeId = a.FeedbackTypeId,
                FeedbackType = a.FeedbackType.Type,
                Client = a.User.RegistrationRequest.Client.Name,
                Application = a.Application.Name,
                Priority = a.Priority,
                Status = a.Status,
                Description = a.Description
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

                await _attachmentService.SaveAsync(entity.Id, dto.LoggedInUserId, dto.Model.Attachments);

                tx.Complete();
            }
        }

        public async Task<FeedbackDetailDto> GetByIdAsync(int id)
        {
            var feedback = await _repo.GetQueryable().Where(a => a.Id == id).Select(MapToFeedbackDetail()).FirstOrDefaultAsync();
            if (feedback == null) throw new ItemNotFoundException("Feedback detail not found.");
            return feedback;
        }

        public async Task UpdateAsync(GenericDto<FeedbackUpdateDto> dto)
        {
            var entity = await _repo.GetByIdAsync(dto.Model.Id) ?? throw new ItemNotFoundException("Feedback not found.");

            var status = entity.Status;
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                entity.UpdateFeedback(dto.LoggedInUserId, dto.Model.FeedbackTypeId, dto.Model.Priority, dto.Model.Title, entity.Description, dto.Model.Status);

                await _repo.UpdateAsync(entity, entity.Id);

                tx.Complete();
            }
            if (await IsValidForNotification(dto.LoggedInUserId, entity, status, dto.Model.Status) == false)
            {
                return;
            }

            var (subject, body) = await _emailContentComposerService.ComposeAsync(TemplateType.FeedbackStatusChanged, new FeedbackStatusUpdatedEmailNotificationDto
            {
                OldStatus = status,
                UpdatedDetail = dto.Model
            });
            _emailSenderService.SendEmailAsync(new EmailMessageDto
            {
                Body = body,
                Subject = subject,
                IsHtml = true,
                To = new List<string> { entity.User.ApplicationUser.Email! }
            });
        }

        public async Task AddCommentAsync(GenericDto<AddFeedbackCommentDto> dto)
        {
            var entity = await _repo.GetByIdAsync(dto.Model.FeedbackId) ?? throw new ItemNotFoundException("Feedback not found.");
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                entity.AddComment(dto.Model.Comment, dto.LoggedInUserId);
                await _repo.UpdateAsync(entity, entity.Id);

                tx.Complete();
            }


            if (dto.LoggedInUserId == entity.UserId)
                return;

            var userNotificationSubscription = await _userNotificationService.GetSetting(entity.UserId, entity.ApplicationId);
            if (!userNotificationSubscription.NotifyOnCommentMade)
                return;
            if (!userNotificationSubscription.FeedbackTypeIds.Contains(entity.FeedbackTypeId))
                return;

            if (!userNotificationSubscription.TriggerStates.Contains(NotificationTriggerStateLevel.AllChanges) && !userNotificationSubscription.TriggerStates.Select(a => (int)a).Contains((int)entity.Status))
                return;

            var (subject, body) = await _emailContentComposerService.ComposeAsync(TemplateType.FeedbackCommentAdded, dto.Model);

            _emailSenderService.SendEmailAsync(new EmailMessageDto
            {
                Body = body,
                Subject = subject,
                IsHtml = true,
                To = new List<string> { entity.User.ApplicationUser.Email! }
            });
        }

        public async Task<List<FeedbackCommentDto>> GetCommentsAsync(int feedbackId)
        {
            var feedback = await _repo.GetQueryableWithNoTracking().FirstOrDefaultAsync(a => a.Id == feedbackId) ?? throw new ItemNotFoundException("Feedback not found");

            return feedback.Histories.OrderByDescending(a => a.CreatedDate).Select(a => new FeedbackCommentDto
            {
                Comment = a.Comment,
                EnteredDate = a.CreatedDate,
                EnteredBy = a.User.FullName
            }).ToList();
        }

        public async Task<List<FeedbackAttachmentDto>> GetAttachmentsAsync(int feedbackId)
        {
            var feedback = await _repo.GetQueryableWithNoTracking().FirstOrDefaultAsync(a => a.Id == feedbackId) ?? throw new ItemNotFoundException("Feedback not found");

            return feedback.Attachments.OrderByDescending(a => a.CreatedDate).Select(a => new FeedbackAttachmentDto
            {
                Id = a.Id,
                FeedbackId = a.FeedbackId,
                AttachmentIdentifier = a.AttachmentIdentifier,
                DisplayName = a.DisplayName,
                EnteredDate = a.CreatedDate,
                EnteredBy = a.User.FullName
            }).ToList();
        }

        public async Task AddAttachmentsAsync(GenericDto<SaveFeedbackAttachmentDto> dto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                await _attachmentService.SaveAsync(dto.Model.FeedbackId, dto.LoggedInUserId, dto.Model.Attachments);

                tx.Complete();
            }
        }

        public async Task<List<FeedbackCountResponseDto>> GetFeedbackCountAsync(GenericDto<FeedbackCountFilterDto> model)
        {
            var dto = model.Model;
            var fromDate = dto.FromDate.ToDateTime(TimeOnly.MinValue);
            var toDate = dto.ToDate.ToDateTime(TimeOnly.MaxValue);

            var queryable = _repo.GetQueryable().Where(a => a.CreatedDate.Date >= fromDate.Date && a.CreatedDate.Date <= toDate.Date);
            if (model.ApplicationId > 0)
            {
                queryable = queryable.Where(a => a.ApplicationId == model.ApplicationId);
            }
            if (model.ClientId > 0)
            {
                queryable = queryable.Where(a => a.User.RegistrationRequest.ClientId == model.ClientId);
            }

            return await queryable.GroupBy(a => a.Status)
                .Select(a => new FeedbackCountResponseDto
                {
                    Status = a.Key,
                    Count = a.Count()
                }).ToListAsync();
        }

        public async Task<List<BoardFeedbackDto>> GetBoardFeedbacksAsync(GenericDto<BoardFeedbackFilterDto> dto)
        {
            var feedbacksQueryable = _repo.GetQueryable().Where(a => a.Status != TicketStatus.OnHold);
            (feedbacksQueryable, List<BoardFeedbackDto> feedbacks) = await GetFilteredBoardFeedbacks(dto, feedbacksQueryable);

            return feedbacks;
        }
        public async Task<List<BoardFeedbackDto>> GetBoardBacklogsAsync(GenericDto<BoardFeedbackFilterDto> dto)
        {
            var feedbacksQueryable = _repo.GetQueryable().Where(a => a.Status == TicketStatus.OnHold);
            (feedbacksQueryable, List<BoardFeedbackDto> feedbacks) = await GetFilteredBoardFeedbacks(dto, feedbacksQueryable);

            return feedbacks;
        }

        private async Task<(IQueryable<Feedback> feedbacksQueryable, List<BoardFeedbackDto> feedbacks)> GetFilteredBoardFeedbacks(GenericDto<BoardFeedbackFilterDto> dto, IQueryable<Feedback> feedbacksQueryable)
        {
            if (dto.Model.FromDate.HasValue)
            {
                var fromDate = dto.Model.FromDate.Value;
                feedbacksQueryable = feedbacksQueryable.Where(a => a.CreatedDate.Date >= fromDate.Date);
            }
            if (dto.Model.ToDate.HasValue)
            {
                var toDate = dto.Model.ToDate.Value;
                feedbacksQueryable = feedbacksQueryable.Where(a => a.CreatedDate.Date <= toDate.Date);
            }

            var feedbacks = await feedbacksQueryable.GroupBy(a => new { a.Application.ShortName, a.User.RegistrationRequest.Client.Code }).Select(a => new BoardFeedbackDto
            {
                Client = a.Key.Code,
                Application = a.Key.ShortName,
                Feedbacks = a.Select(b => new BoardFeedbackDetailDto
                {
                    Id = b.Id,
                    TicketId = b.TicketId,
                    Title = b.Title,
                    Status = b.Status,
                    RaisedBy = b.User.FullName,
                    RaisedDate = b.CreatedDate,
                    FeedbackType = new FeedbackTypeDto
                    {
                        Id = b.FeedbackTypeId,
                        Type = b.FeedbackType.Type,
                        Color = b.FeedbackType.Color
                    }
                })

            }).ToListAsync();
            return (feedbacksQueryable, feedbacks);
        }

        public async Task<List<FeedbackRevisionDto>> GetRevisionsAsync(int feedbackId)
        {
            var feedback = await _repo.GetQueryable()
                .Include(a => a.Revisions)
                .ThenInclude(a => a.ChangedFields)
                .AsSplitQuery().FirstOrDefaultAsync(a => a.Id == feedbackId) ?? throw new ItemNotFoundException("Feedback not found");

            return feedback.Revisions.OrderByDescending(a => a.ChangedAt).Select(a => new FeedbackRevisionDto
            {
                Id = a.Id,
                FeedbackId = a.FeedbackId,
                ChangedBy = a.User.FullName,
                ChangedAt = a.ChangedAt,
                ChangedFields = a.ChangedFields.Select(b => new FeedbackChangedFieldDto
                {
                    FieldName = b.FieldName,
                    OldValue = b.OldValue,
                    NewValue = b.NewValue,
                    DisplayName = b.GetDisplayName()
                }).ToList()
            }).ToList();
        }

        public async Task UpdateStatusAsync(GenericDto<FeedbackStatusUpdateDto> dto)
        {
            var entity = await _repo.GetByIdAsync(dto.Model.FeedbackId) ?? throw new ItemNotFoundException("Feedback not found.");

            var status = entity.Status;
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                entity.UpdateStatus(dto.LoggedInUserId, dto.Model.NewStatus);

                await _repo.UpdateAsync(entity, entity.Id);

                tx.Complete();
            }

            if (await IsValidForNotification(dto.LoggedInUserId, entity, status, dto.Model.NewStatus) == false)
            {
                return;
            }


            var (subject, body) = await _emailContentComposerService.ComposeAsync(TemplateType.FeedbackStatusChanged, new FeedbackStatusUpdatedEmailNotificationDto
            {
                OldStatus = status,
                UpdatedDetail = new FeedbackUpdateDto
                {
                    Id = entity.Id,
                    FeedbackTypeId = entity.FeedbackTypeId,
                    Title = entity.Title,
                    Status = dto.Model.NewStatus,
                    Priority = entity.Priority,
                    Description = entity.Description
                }
            });
            _emailSenderService.SendEmailAsync(new EmailMessageDto
            {
                Body = body,
                Subject = subject,
                IsHtml = true,
                To = new List<string> { entity.User.ApplicationUser.Email! }
            });
        }

        private async Task<bool> IsValidForNotification(int userId, Feedback entity, TicketStatus oldStatus, TicketStatus newStatus)
        {
            if (userId == entity.UserId || newStatus == entity.Status)
                return false;
            var userNotificationSubscription = await _userNotificationService.GetSetting(entity.UserId, entity.ApplicationId);
            if (!userNotificationSubscription.NotifyOnStatusChange)
                return false;
            if (!userNotificationSubscription.FeedbackTypeIds.Contains(entity.FeedbackTypeId))
                return false;

            if (!userNotificationSubscription.TriggerStates.Contains(NotificationTriggerStateLevel.AllChanges) && !userNotificationSubscription.TriggerStates.Select(a => (int)a).Contains((int)entity.Status))
                return false;

            return true;
        }

        public async Task LinkFeedbackAsync(GenericDto<LinkFeedbackDto> dto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var sourceFeedback = await _repo.GetByIdAsync(dto.Model.SourceId) ?? throw new ItemNotFoundException("Source feedback not found.");
                var targetFeedback = await _repo.GetByIdAsync(dto.Model.TargetId) ?? throw new ItemNotFoundException("Target feedback not found.");
                sourceFeedback.LinkFeedback(targetFeedback, dto.LoggedInUserId, dto.Model.LinkType);
                await _repo.UpdateAsync(sourceFeedback, sourceFeedback.Id);
                tx.Complete();
            }
        }

        public async Task<List<LinkedFeedbackDto>> GetLinkedFeedbacks(int feedbackId)
        {
            var links = await _feedbacksLinkRepo.GetQueryable().Where(a => a.SourceFeedbackId == feedbackId || a.TargetFeedbackId == feedbackId).ToListAsync();

            List<LinkedFeedbackDto> response = new();

            foreach (var link in links)
            {
                var relatedFeedback = link.SourceFeedbackId == feedbackId ? link.TargetFeedback : link.SourceFeedback;
                response.Add(new LinkedFeedbackDto()
                {
                    LinkId = link.Id,
                    SourceFeedbackId = link.SourceFeedbackId,
                    TargetFeedbackId = link.TargetFeedbackId,
                    RelatedTicketId = relatedFeedback.TicketId,
                    RelatedFeedbackTitle = relatedFeedback.Title,
                    LinkType =FeedbackLinkTypeHelper.GetLinkDisplayName(link.LinkType, link.TargetFeedbackId == feedbackId),
                    LinkedDate = link.CreatedDate,
                    LinkedBy = link.UserDetail.FullName
                });
            }

            return response;
        }

        public async Task<FeedbackBasicDetailDto> GetByTicketIdAsync(int ticketId)
        {
            var feedback = await _repo.GetQueryable().Where(a=>a.TicketId ==ticketId ).Select(MapToFeedbackBasicDetail()).FirstOrDefaultAsync();

            return feedback;
        }

        public async Task UnlinkFeedbackAsync(int linkId, int userId)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var link = await _feedbacksLinkRepo.GetByIdAsync(linkId) ?? throw new ItemNotFoundException("Link not found.");

                var sourceFeedback = link.SourceFeedback;
                var targetFeedback = link.TargetFeedback;

                sourceFeedback.UnlinkFeedback(targetFeedback,userId);
                await _repo.UpdateAsync(sourceFeedback, sourceFeedback.Id);
                tx.Complete();
            }
        }
    }
}
