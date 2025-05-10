using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public override Task<IActionResult> HandleAsync([FromBody] ApplicationDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                await _applicationService.SaveAsync(request);
                return "Application saved successfully";
            }, "Failed to save application");
        }

    }
}
