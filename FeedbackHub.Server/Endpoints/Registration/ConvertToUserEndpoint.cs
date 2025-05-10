using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Registration
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class ConvertToUserEndpoint : EndpointBaseAsync.WithRequest<ConvertRegistrationRequestToUserDto>.WithResult<IActionResult>
    {
        private readonly IRegistrationRequestService _registrationRequestService;
        public ConvertToUserEndpoint(IRegistrationRequestService registrationRequestService)
        {
            _registrationRequestService = registrationRequestService;
        }

        [HttpPost("/registration-request/convert-to-user")]
        public override async Task<IActionResult> HandleAsync([FromBody] ConvertRegistrationRequestToUserDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                await _registrationRequestService.AcceptRegistrationAsync(request);
                return "Registration request converted to user successfully."; 
            }, "Failed to convert registration request to user.");
        }

    }
}
