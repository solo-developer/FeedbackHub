using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Application
{
    public class GetAllEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        private readonly IApplicationService _applicationService;
        public GetAllEndpoint(IApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpGet("/applications")]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var applications = await _applicationService.GetAllAsync();

                return ApiResponse.Success(applications);

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get applications", ex);
            }
            return ApiResponse.Error("Failed to get applications");
        }
    }
}
