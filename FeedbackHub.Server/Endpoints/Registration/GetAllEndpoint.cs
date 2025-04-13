using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Implementations;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Registration
{
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
