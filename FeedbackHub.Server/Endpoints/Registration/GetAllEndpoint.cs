using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Implementations;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

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
        public override async Task<IActionResult> HandleAsync(RegistrationRequestFilterDto request, CancellationToken cancellationToken = default)
        {
            try
            {
                request.State = (int)RegistrationRequestState.UnconvertedRequest;
                var requests = await _registrationRequestService.GetAsync(request);

                return ApiResponse.Success(requests);

            }
            catch (CustomException ex)
            {
               return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get registration requests", ex);
            }
            return ApiResponse.Error("Failed to get registration requests");
        }
    }
}
