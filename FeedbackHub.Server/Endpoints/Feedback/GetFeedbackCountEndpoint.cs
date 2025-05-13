using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto.Feedback;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetFeedbackCountEndpoint : EndpointBaseAsync.WithRequest<FeedbackCountFilterDto>
        .WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public GetFeedbackCountEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService = feedbackService;
            _userContext = userContext;
        }

        [HttpGet("/feedbacks/count")]
        public override async Task<IActionResult> HandleAsync([FromQuery]FeedbackCountFilterDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var counts = await _feedbackService.GetFeedbackCountAsync(request.ToGenericDto(_userContext));
                return counts;
            }, "Failed to get feedback counts");
        }
    }
}
