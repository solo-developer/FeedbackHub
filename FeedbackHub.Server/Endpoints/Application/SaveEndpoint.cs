using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Implementations;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Application
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class SaveEndpoint : EndpointBaseAsync.WithRequest<ApplicationDto>.WithResult<IActionResult>
    {
        private readonly IApplicationService _applicationService;
        public SaveEndpoint(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }
        [HttpPost("/application")]
        public override async Task<IActionResult> HandleAsync([FromBody] ApplicationDto request, CancellationToken cancellationToken = default)
        {

            try
            {
                await _applicationService.SaveAsync(request);

                return ApiResponse.Success("Application saved successfully");

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to save application", ex);
            }
            return ApiResponse.Error("Failed to save application");
        }
    }
}
