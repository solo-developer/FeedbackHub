using Ardalis.ApiEndpoints;
using Azure.Core;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetFeedbackByIdEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IFeedbackService _feedbackService;
        public GetFeedbackByIdEndpoint(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet("/feedback/{id}")]
        public override async Task<IActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            try
            {
                var feedback = await _feedbackService.GetByIdAsync(id);

                return ApiResponse.Success(feedback);
            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get feedback detail", ex);
            }
            return ApiResponse.Error("Failed to get feedback detail");
        }
    }
}
