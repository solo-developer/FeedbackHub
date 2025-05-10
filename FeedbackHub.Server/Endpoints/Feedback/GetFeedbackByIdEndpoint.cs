using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetFeedbackByIdEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackByIdEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedback/{id}")]
        public override Task<IActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(
                async () =>await _feedbackService.GetByIdAsync(id),
                "Failed to get feedback detail"
            );
        }

    }
}
