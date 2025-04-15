using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class RegistrationRequestService : IRegistrationRequestService
    {
        private readonly IBaseRepository<RegistrationRequest> _registrationRequestRepo;
        private readonly IRoleRepository _roleRepo;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;


        public RegistrationRequestService(IBaseRepository<RegistrationRequest> registrationRequestRepo, IRoleRepository roleRepo, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _registrationRequestRepo = registrationRequestRepo;
            _roleRepo = roleRepo;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task AcceptRegistrationAsync(int registrationId, string password, List<int> appIds)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var regRequest = await _registrationRequestRepo.GetByIdAsync(registrationId);
                if (regRequest == null) throw new ItemNotFoundException("Registration not found");

                var userDetail = UserDetail.Create(regRequest.FullName, regRequest.Email.Value, appIds);

                var appUser = userDetail.ApplicationUser;
                var result = await _userManager.CreateAsync(appUser, password);
                if (!result.Succeeded) throw new Exception("User creation failed");

                
                await _userManager.AddToRoleAsync(appUser, Constants.CLIENT_ROLE);

                regRequest.AcceptRegistration(userDetail);
                await _registrationRequestRepo.UpdateAsync(regRequest, regRequest.Id);
                tx.Complete();
            }
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
