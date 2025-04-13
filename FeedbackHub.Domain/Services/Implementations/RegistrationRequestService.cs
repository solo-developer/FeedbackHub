using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class RegistrationRequestService : IRegistrationRequestService
    {
        private readonly IBaseRepository<RegistrationRequest> _registrationRequestRepo;
        public RegistrationRequestService(IBaseRepository<RegistrationRequest> registrationRequestRepo)
        {
            _registrationRequestRepo = registrationRequestRepo;
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
                Id= a.Id,
                Name= a.FullName,
                IsUser= a.ConvertedUserId!=null,
                RequestedAt= a.RequestedAt,
                Email= a.Email,
                Client= new ClientDto
                {
                    Id=a.ClientId,
                    Name= a.Client.Name,
                    Code= a.Client.Code
                }
            }).OrderByDescending(a=>a.RequestedAt).Skip(filter.Skip).Take(filter.Take).ToListAsync();

            return new PaginatedDataResponseDto<RegistrationRequestDto> { TotalCount = totalCount,Data = response };

        }
    }
}
