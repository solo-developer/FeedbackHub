using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.Feedback;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class GetFeedbackCountEndpoint : EndpointBaseAsync.WithRequest<FeedbackCountFilterDto>
        .WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackCountEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedbacks/count")]
        public override async Task<IActionResult> HandleAsync([FromQuery]FeedbackCountFilterDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var counts = await _feedbackService.GetFeedbackCountAsync(request);
                return counts;
            }, "Failed to get feedback counts");
        }
    }
}
