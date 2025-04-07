using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Client
{
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

            return Ok(JsonWrapper.BuildSuccessJson("Client Organization saved successfully."));
        }
    }
}
