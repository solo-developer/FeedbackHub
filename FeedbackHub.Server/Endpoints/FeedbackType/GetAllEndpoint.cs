using Ardalis.ApiEndpoints;
using Azure.Core;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Swashbuckle.AspNetCore.Annotations;

namespace FeedbackHub.Server.Endpoints.FeedbackType
{
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
