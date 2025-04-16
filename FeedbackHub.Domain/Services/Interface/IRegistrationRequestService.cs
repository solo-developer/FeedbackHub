using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IRegistrationRequestService
    {
        Task<PaginatedDataResponseDto<RegistrationRequestDto>> GetAsync(RegistrationRequestFilterDto filter);

        Task AcceptRegistrationAsync(ConvertRegistrationRequestToUserDto dto);
    }
}
