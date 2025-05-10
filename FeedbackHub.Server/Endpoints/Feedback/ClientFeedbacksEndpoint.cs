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
    [Authorize(Roles =Constants.CLIENT_ROLE)]
    public class ClientFeedbacksEndpoint : EndpointBaseAsync.WithRequest<FeedbackFilterDto>.WithResult<IActionResult>
    {
        private readonly IUserContext _userContext;
        private readonly IFeedbackService _feedbackService;
        public ClientFeedbacksEndpoint(IUserContext userContext, IFeedbackService feedbackService)
        {
            _userContext = userContext;
            _feedbackService = feedbackService;
        }

        [HttpPost("/feedbacks")]
        public override Task<IActionResult> HandleAsync([FromBody] FeedbackFilterDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var feedbacks = await _feedbackService.GetAsync(request.ToGenericDto(_userContext));
                return feedbacks;
            }, "Failed to get feedbacks"); 
        }

    }
}
