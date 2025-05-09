using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto.Feedback;
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
    public class AddFeedbackCommentEndpoint : EndpointBaseAsync.WithRequest<AddFeedbackCommentDto>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        private readonly IUserContext _userContext;
        public AddFeedbackCommentEndpoint(IFeedbackService feedbackService, IUserContext userContext)
        {
            _feedbackService = feedbackService;
            _userContext = userContext;
        }

        [HttpPost("/feedback/comment")]
        public override async Task<IActionResult> HandleAsync([FromBody]AddFeedbackCommentDto request, CancellationToken cancellationToken = default)
        {
            try
            {
                await _feedbackService.AddCommentAsync(request.ToGenericDto(_userContext));

                return ApiResponse.Success("Comment saved successfully");

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to save feedback comment", ex);
            }
            return ApiResponse.Error("Failed to save comment");
        }
    }
}
