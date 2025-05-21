using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetLinkedFeedbacksEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetLinkedFeedbacksEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService =  feedbackService;
        }
        [HttpGet("/feedback/{feedbackId}/linked-feedbacks")]
        public override async Task<IActionResult> HandleAsync(int feedbackId, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var data = await _feedbackService.GetLinkedFeedbacks(feedbackId);
                return data;
            }, "Failed to get linked feedbacks");
        }
    }
}
