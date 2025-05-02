using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Helpers;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

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
        public override async Task<IActionResult> HandleAsync([FromForm]SaveFeedbackDto request, CancellationToken cancellationToken = default)
        {
            try
            {
                await _feedbackService.SaveAsync(request.ToGenericDto(_userContext));

                return ApiResponse.Success("Feedback submitted successfully");

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to save feedback", ex);
            }
            return ApiResponse.Error("Failed to save feedback");
        }
    }
}
