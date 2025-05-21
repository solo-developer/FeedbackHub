using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetFeedbackByTicketIdEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackByTicketIdEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedback/ticket-detail/{ticketId}")]
        public override Task<IActionResult> HandleAsync(int ticketId, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(
               async () => await _feedbackService.GetByTicketIdAsync(ticketId),
               "Failed to get ticket detail"
           );
        }
    }
}
