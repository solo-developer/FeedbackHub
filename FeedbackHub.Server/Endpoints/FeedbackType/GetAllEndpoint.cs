﻿using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
            return await ApiHandler.HandleAsync(async () =>
            {
                var feedbackTypes = await _feedbackTypeService.GetFeedbackTypesAsync();
                return feedbackTypes;
            }, "Failed to get feedback types");
        }

    }
}
