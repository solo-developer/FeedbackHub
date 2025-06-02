using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.TicketStatus
{
    [Authorize]
    public class GetTicketStatusOptionsEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        [HttpGet("/ticket-status-options")]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var options = EnumExtensions.ToOptions<Domain.Enums.TicketStatus>().Select(a => new GenericDropdownDto<int, string>()
                {
                    Label = a.Label,
                    Value = a.Value
                });

                return options;
            }, "Failed to get ticket status options");
        }
    }
}
