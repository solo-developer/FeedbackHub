﻿using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.FeedbackType
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class DeleteEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IBaseRepository<Domain.Entities.FeedbackType> _feedbackTypeRepo;
       
        public DeleteEndpoint(IBaseRepository<Domain.Entities.FeedbackType> feedbackTypeRepo)
        {
            _feedbackTypeRepo = feedbackTypeRepo;
        }

        [HttpDelete("/feedback-type/{id}")]
        public override async Task<IActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var feedbackType = await _feedbackTypeRepo.GetByIdAsync(id)
                                    ?? throw new ItemNotFoundException("Feedback type not found");

                feedbackType.MarkDeleted();

                await _feedbackTypeRepo.UpdateAsync(feedbackType, feedbackType.Id);

                return "Feedback Type deleted successfully."; 
            }, "Failed to delete feedback type");
        }

    }
}
