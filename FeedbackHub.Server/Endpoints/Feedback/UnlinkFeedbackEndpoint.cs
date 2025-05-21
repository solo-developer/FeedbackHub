using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class UnlinkFeedbackEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public UnlinkFeedbackEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService = feedbackService;
            _userContext = userContext;
        }

        [HttpDelete("/feedback/unlink")]
        public override async Task<IActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                await _feedbackService.UnlinkFeedbackAsync(id,_userContext.UserId.Value);
                return "Feedback unlinked successfully";
            }, "Failed to unlink feedback");
        }
    }
}
