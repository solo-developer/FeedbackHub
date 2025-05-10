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
    [Authorize(Roles =Constants.ADMIN_ROLE)]
    public class AdminFeedbacksEndpoint : EndpointBaseAsync.WithRequest<AdminFeedbackFilterDto>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public AdminFeedbacksEndpoint(IFeedbackService feedbackService,IUserContext userContext)
        {
            _feedbackService = feedbackService;
            _userContext =  userContext;
        }

        [HttpPost("/admin/feedbacks")]
        public override Task<IActionResult> HandleAsync([FromBody] AdminFeedbackFilterDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var feedbacks = await _feedbackService.GetAsync(request.ToGenericDto(_userContext));
                return feedbacks; 
            }, "Failed to get feedbacks");
        }

    }
}
