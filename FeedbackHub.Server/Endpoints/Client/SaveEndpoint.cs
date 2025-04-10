using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Client
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class SaveEndpoint : EndpointBaseAsync.WithRequest<ClientDto>.WithResult<IActionResult>
    {
        private readonly IBaseRepository<Domain.Entities.Client> _clientRepo;
        public SaveEndpoint(IBaseRepository<Domain.Entities.Client> feedbackTypeRepo)
        {
            _clientRepo = feedbackTypeRepo;
        }

        [HttpPost("/client")]
        public override async Task<IActionResult> HandleAsync([FromBody] ClientDto request, CancellationToken cancellationToken = default)
        {
            var client = new Domain.Entities.Client(request.Name,request.Code) ;
            await _clientRepo.InsertAsync(client);

            return ApiResponse.Success("Client Organization saved successfully.");
        }
    }
}
