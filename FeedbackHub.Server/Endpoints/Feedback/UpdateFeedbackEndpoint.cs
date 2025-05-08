using Ardalis.ApiEndpoints;
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
        public override async Task<IActionResult> HandleAsync([FromBody]FeedbackUpdateDto request, CancellationToken cancellationToken = default)
        {
            try
            {
                await _feedbackService.UpdateAsync(request.ToGenericDto(_userContext));

                return ApiResponse.Success("Feedback updated successfully");

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to update feedback", ex);
            }
            return ApiResponse.Error("Failed to update feedback");
        }
    }
}
