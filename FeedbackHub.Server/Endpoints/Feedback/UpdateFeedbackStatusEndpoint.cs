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
    public class UpdateFeedbackStatusEndpoint : EndpointBaseAsync.WithRequest<FeedbackStatusUpdateDto>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public UpdateFeedbackStatusEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService = feedbackService;
            _userContext = userContext;
        }

        [HttpPatch("/feedback/status")]
        public override async Task<IActionResult> HandleAsync([FromBody]FeedbackStatusUpdateDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                await _feedbackService.UpdateStatusAsync(request.ToGenericDto(_userContext));
                return "Feedback status updated successfully";
            }, "Failed to update status");
        }
    }
}
