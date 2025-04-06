using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.FeedbackType
{
    public class SaveEndpoint : EndpointBaseAsync.WithRequest<FeedbackTypeDto>.WithResult<IActionResult>
    {
        private readonly IBaseRepository<Domain.Entities.FeedbackType> _feedbackTypeRepo;
        public SaveEndpoint(IBaseRepository<Domain.Entities.FeedbackType> feedbackTypeRepo)
        {
            _feedbackTypeRepo = feedbackTypeRepo;
        }

        [HttpPost("/feedback-type")]
        public override async Task<IActionResult> HandleAsync([FromBody]FeedbackTypeDto request, CancellationToken cancellationToken = default)
        {
            var feedbackType = new Domain.Entities.FeedbackType() { Type = request.Type, Color = request.Color };
            await _feedbackTypeRepo.InsertAsync(feedbackType);

            return Ok(JsonWrapper.BuildSuccessJson("Feedback Type saved successfully."));
        }
    }
}
