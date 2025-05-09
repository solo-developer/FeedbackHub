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
    public class GetFeedbackAttachmentsEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackAttachmentsEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedbacks/{feedbackId}/attachments")]
        public override async Task<IActionResult> HandleAsync(int feedbackId, CancellationToken cancellationToken = default)
        {
            try
            {
                var attachments = await _feedbackService.GetAttachmentsAsync(feedbackId);

                return ApiResponse.Success(attachments);

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get attachments", ex);
            }
            return ApiResponse.Error("Failed to get attachments");
        }
    }
}
