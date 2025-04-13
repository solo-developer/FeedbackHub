using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Swashbuckle.AspNetCore.Annotations;

namespace FeedbackHub.Server.Endpoints.Client
{
    //[Authorize(Roles = Constants.ADMIN_ROLE)]
    [AllowAnonymous]
    public class GetAllEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        private readonly IClientService _clientService;
        public GetAllEndpoint(IClientService clientService)
        {
          _clientService = clientService;
        }

        [HttpGet("/client")]

        [SwaggerOperation(
        Summary = "Clients",
        Description = "Gets all list of clients",
        OperationId = "Client_getall",
        Tags = new[] { "Client_GetAllEndpoint" })
        ]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var clients = await _clientService.GetAllClientsAsync();

                return ApiResponse.Success(clients);

            }
            catch (CustomException ex)
            {
              return  ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get clients", ex);
            }
            return ApiResponse.Error("Failed to get clients");
        }
    }
}
