using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.Feedback;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class LinkFeedbackEndpoint : EndpointBaseAsync.WithRequest<LinkFeedbackDto>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public LinkFeedbackEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService= feedbackService;
            _userContext = userContext;
        }

        [HttpPost("/feedback/link")]
        public override async Task<IActionResult> HandleAsync([FromBody]LinkFeedbackDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                await _feedbackService.LinkFeedbackAsync(request.ToGenericDto(_userContext));
                return "Feedbacks linked successfully";
            }, "Failed to link feedbacks");
        }
    }
}
