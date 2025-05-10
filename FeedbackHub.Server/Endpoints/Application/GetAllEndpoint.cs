using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Mvc;

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
        public override Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var applications = await _applicationService.GetAllAsync();
                return applications;
            }, "Failed to get applications");
        }

    }
}
