using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using System.Transactions;

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
            try
            {
                await _registrationRequestService.AcceptRegistrationAsync(request);
               
                return ApiResponse.Success("Registration request converted to user successfully.");

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to convert registration request to user", ex);
            }
            return ApiResponse.Error("Failed to convert registration request to user");
        }
    }
}
