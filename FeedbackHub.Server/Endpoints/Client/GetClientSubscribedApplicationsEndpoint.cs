using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Client
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class GetClientSubscribedApplicationsEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IClientService _clientService;
        public GetClientSubscribedApplicationsEndpoint(IClientService clientService)
        {
          _clientService = clientService;
        }


        [HttpGet("/client/{clientId}/applications")]
        public override Task<IActionResult> HandleAsync(int clientId, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var applications = await _clientService.GetSubscribedApplicationsByClientIdAsync(clientId);
                return applications;
            }, "Failed to get subscribed applications");
        }
    }
}
