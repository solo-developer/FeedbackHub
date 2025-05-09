using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetFeedbackCommentEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackCommentEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedbacks/{feedbackId}/comments")]
        public override async Task<IActionResult> HandleAsync(int feedbackId, CancellationToken cancellationToken = default)
        {
            try
            {
                var feedbacks = await _feedbackService.GetCommentsAsync(feedbackId);

                return ApiResponse.Success(feedbacks);

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get comments", ex);
            }
            return ApiResponse.Error("Failed to get comments");
        }
    }
}
