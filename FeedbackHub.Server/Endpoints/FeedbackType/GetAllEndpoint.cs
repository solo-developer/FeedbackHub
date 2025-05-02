using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using Swashbuckle.AspNetCore.Annotations;

namespace FeedbackHub.Server.Endpoints.FeedbackType
{
    [Authorize]
    public class GetAllEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        private readonly IFeedbackTypeService _feedbackTypeService;
        public GetAllEndpoint(IFeedbackTypeService feedbackTypeService)
        {
          _feedbackTypeService = feedbackTypeService;
        }

        [HttpGet("/feedback-type")]
        [SwaggerOperation(
        Summary = "Feedback Types",
        Description = "Gets all list of feedback types",
        OperationId = "Feedbacktype_getall",
        Tags = new[] { "Feedback_GetAllEndpoint" })
        ]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var feedbackTypes = await _feedbackTypeService.GetFeedbackTypesAsync();

                return ApiResponse.Success(feedbackTypes);
            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get feedback types", ex);
            }
            return ApiResponse.Error("Failed to get feedback types");
        }
    }
}
