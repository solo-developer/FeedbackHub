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
    [Authorize(Roles = Constants.CLIENT_ROLE)]
    public class NewFeedbackEndpoint : EndpointBaseAsync.WithRequest<SaveFeedbackDto>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public NewFeedbackEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService = feedbackService;
            _userContext = userContext;
        }

        [HttpPost("/feedback/new")]
        public override async Task<IActionResult> HandleAsync([FromForm] SaveFeedbackDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                await _feedbackService.SaveAsync(request.ToGenericDto(_userContext));
                return "Feedback submitted successfully"; 
            }, "Failed to save feedback");
        }

    }
}
