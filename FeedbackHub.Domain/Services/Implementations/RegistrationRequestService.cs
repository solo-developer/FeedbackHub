using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Domain.Templating;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class RegistrationRequestService : IRegistrationRequestService
    {
        private readonly IBaseRepository<RegistrationRequest> _registrationRequestRepo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSenderService _emailSenderService;
        private readonly IEmailContentComposer _emailContentComposer;

        public RegistrationRequestService(IBaseRepository<RegistrationRequest> registrationRequestRepo, UserManager<ApplicationUser> userManager, IEmailSenderService emailSenderService, IEmailContentComposer emailContentComposer)
        {
            _registrationRequestRepo = registrationRequestRepo;
            _userManager = userManager;
            _emailSenderService = emailSenderService;
            _emailContentComposer = emailContentComposer;
        }

        public async Task AcceptRegistrationAsync(ConvertRegistrationRequestToUserDto dto)
        {
            RegistrationRequest regRequest = null;
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                regRequest = await _registrationRequestRepo.GetByIdAsync(dto.RegistrationRequestId);
                if (regRequest == null) throw new ItemNotFoundException("Registration not found");

                var userDetail = UserDetail.CreateClientUser(regRequest.Id, regRequest.FullName, regRequest.Email.Value,regRequest.ClientId, dto.ApplicationIds);

                var appUser = userDetail.ApplicationUser;
                var result = await _userManager.CreateAsync(appUser, dto.Password);
                if (!result.Succeeded) throw new Exception("User creation failed");


                await _userManager.AddToRoleAsync(appUser, Constants.CLIENT_ROLE);

                regRequest.AcceptRegistration(userDetail);
                await _registrationRequestRepo.UpdateAsync(regRequest, regRequest.Id);
                tx.Complete();
            }

            var (subject, body) = await _emailContentComposer.ComposeAsync(TemplateType.RegistrationRequestAccepted, dto);

            _emailSenderService.SendEmailAsync(new EmailMessageDto
            {
                Body = body,
                Subject = subject,
                IsHtml = true,
                To = new List<string> { regRequest.Email.Value }
            });
        }

        public async Task<PaginatedDataResponseDto<RegistrationRequestDto>> GetAsync(RegistrationRequestFilterDto filter)
        {
            var queryable = _registrationRequestRepo.GetQueryable();

            if (filter.State.HasValue && Enum.IsDefined(typeof(RegistrationRequestState), filter.State.Value))
            {
                var state = (RegistrationRequestState)filter.State.Value;
                if (state == RegistrationRequestState.UnconvertedRequest)
                {
                    queryable = queryable.Where(a => a.ConvertedUserId == null);
                }
                else
                {
                    queryable = queryable.Where(a => a.ConvertedUserId != null);
                }
            }
            if (!string.IsNullOrEmpty(filter.Search))
            {
                queryable = queryable.Where(a => a.Email.Equals(filter.Search));
            }

            var totalCount = await queryable.CountAsync();

            var response = await queryable.Select(a => new RegistrationRequestDto
            {
                Id = a.Id,
                Name = a.FullName,
                IsUser = a.ConvertedUserId != null,
                RequestedAt = a.RequestedAt,
                Email = a.Email,
                Client = new ClientDto
                {
                    Id = a.ClientId,
                    Name = a.Client.Name,
                    Code = a.Client.Code
                }
            }).OrderByDescending(a => a.RequestedAt).Skip(filter.Skip).Take(filter.Take).ToListAsync();

            return new PaginatedDataResponseDto<RegistrationRequestDto> { TotalCount = totalCount, Data = response };

        }
    }
}
