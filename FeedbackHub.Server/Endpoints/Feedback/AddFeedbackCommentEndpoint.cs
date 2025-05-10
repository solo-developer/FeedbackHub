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
    public class AddFeedbackCommentEndpoint : EndpointBaseAsync.WithRequest<AddFeedbackCommentDto>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public AddFeedbackCommentEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService = feedbackService;
            _userContext = userContext;
        }

        [HttpPost("/feedback/comment")]
        public override Task<IActionResult> HandleAsync([FromBody] AddFeedbackCommentDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                await _feedbackService.AddCommentAsync(request.ToGenericDto(_userContext));
                return "Comment saved successfully";
            }, "Failed to save feedback comment"); 
        }

    }
}
