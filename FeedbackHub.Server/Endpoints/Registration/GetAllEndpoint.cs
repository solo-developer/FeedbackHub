using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Registration
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class GetAllEndpoint : EndpointBaseAsync.WithRequest<RegistrationRequestFilterDto>.WithResult<IActionResult>
    {
        private readonly IRegistrationRequestService _registrationRequestService;
        public GetAllEndpoint(IRegistrationRequestService registrationRequestService)
        {
            _registrationRequestService = registrationRequestService;
        }

        [HttpPost("/registration-requests")]
        public override async Task<IActionResult> HandleAsync([FromBody]RegistrationRequestFilterDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                request.State = (int)RegistrationRequestState.UnconvertedRequest;
                var requests = await _registrationRequestService.GetAsync(request);
                return requests; 
            }, "Failed to get registration requests");
        }

    }
}
