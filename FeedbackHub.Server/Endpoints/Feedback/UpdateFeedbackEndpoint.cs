using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class UpdateFeedbackEndpoint : EndpointBaseAsync.WithRequest<FeedbackUpdateDto>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public UpdateFeedbackEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService =  feedbackService;
            _userContext = userContext;
        }

        [HttpPost("/feedback/update")]
        public override async Task<IActionResult> HandleAsync([FromBody] FeedbackUpdateDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                await _feedbackService.UpdateAsync(request.ToGenericDto(_userContext));
                return "Feedback updated successfully"; 
            }, "Failed to update feedback");
        }

    }
}
