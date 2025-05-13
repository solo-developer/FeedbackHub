using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Client
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class UpdateClientEndpoint : EndpointBaseAsync.WithRequest<ClientSaveDto>.WithResult<IActionResult>
    {
        private readonly IClientService _clientService;
        public UpdateClientEndpoint(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpPut("/client")]
        public override Task<IActionResult> HandleAsync([FromBody] ClientSaveDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                await _clientService.UpdateAsync(request);

                return "Client Organization saved successfully.";
            }, "Failed to save client");
        }
    }
}
