using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Logging;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Client
{
    public class DeleteEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IBaseRepository<Domain.Entities.Client> _clientRepo;
       
        public DeleteEndpoint(IBaseRepository<Domain.Entities.Client> feedbackTypeRepo)
        {
            _clientRepo = feedbackTypeRepo;
        }

        [HttpDelete("/client/{id}")]
        public override async Task<IActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            try
            {
                var client = await _clientRepo.GetByIdAsync(id) ?? throw new ItemNotFoundException("Client Organization not found");

                client.Disable();

                await _clientRepo.UpdateAsync(client,client.Id);

                return Ok(JsonWrapper.BuildSuccessJson("Client deleted successfully."));
            }
            catch (CustomException ex)
            {
                return Ok(JsonWrapper.BuildInfoJson(ex.Message));
            }
            catch (Exception ex)
            {
                SerilogLogger.Logger.Error("Failed to delete client", ex);
                return Ok(JsonWrapper.BuildErrorJson("Failed to delete client."));
            }
        }
    }
}
