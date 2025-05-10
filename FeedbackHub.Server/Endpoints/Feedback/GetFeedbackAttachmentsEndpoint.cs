using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetFeedbackAttachmentsEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackAttachmentsEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedbacks/{feedbackId}/attachments")]
        public override Task<IActionResult> HandleAsync(int feedbackId, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(
                async () =>await _feedbackService.GetAttachmentsAsync(feedbackId),
                "Failed to get attachments"
            );
        }

    }
}
