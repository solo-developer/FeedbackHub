using Ardalis.ApiEndpoints;
using Azure.Core;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetFeedbackRevisionsEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackRevisionsEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedback/{feedbackId}/revisions")]
        public override async Task<IActionResult> HandleAsync(int feedbackId, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var data = await _feedbackService.GetRevisionsAsync(feedbackId);
                return data;
            }, "Failed to get revisions");
        }
    }
}
