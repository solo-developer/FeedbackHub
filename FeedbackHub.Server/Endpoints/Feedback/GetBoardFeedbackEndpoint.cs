using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class GetBoardFeedbackEndpoint : EndpointBaseAsync.WithRequest<BoardFeedbackFilterDto>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public GetBoardFeedbackEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService = feedbackService;
            _userContext = userContext;
        }

        [HttpGet("/feedback/board")]
        public override async Task<IActionResult> HandleAsync([FromQuery] BoardFeedbackFilterDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var data = await _feedbackService.GetBoardFeedbacksAsync(request.ToGenericDto(_userContext));
                return data;
            }, "Failed to get feedbacks");
        }
    }
}
