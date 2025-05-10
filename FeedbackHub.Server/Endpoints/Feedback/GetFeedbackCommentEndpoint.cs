using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetFeedbackCommentEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackCommentEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedbacks/{feedbackId}/comments")]
        public override async Task<IActionResult> HandleAsync(int feedbackId, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                return await _feedbackService.GetCommentsAsync(feedbackId);  
            }, "Failed to get comments");
        }

    }
}
