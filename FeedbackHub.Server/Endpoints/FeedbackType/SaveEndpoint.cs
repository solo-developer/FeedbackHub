﻿using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.FeedbackType
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class SaveEndpoint : EndpointBaseAsync.WithRequest<FeedbackTypeDto>.WithResult<IActionResult>
    {
        private readonly IBaseRepository<Domain.Entities.FeedbackType> _feedbackTypeRepo;
        public SaveEndpoint(IBaseRepository<Domain.Entities.FeedbackType> feedbackTypeRepo)
        {
            _feedbackTypeRepo = feedbackTypeRepo;
        }

        [HttpPost("/feedback-type")]
        public override async Task<IActionResult> HandleAsync([FromBody] FeedbackTypeDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var feedbackType = new Domain.Entities.FeedbackType(request.Type,request.Color);

                await _feedbackTypeRepo.InsertAsync(feedbackType);

                return "Feedback Type saved successfully."; 
            }, "Failed to save feedback type.");
        }

    }
}
