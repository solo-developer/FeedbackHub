using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Logging;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.FeedbackType
{
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
            try
            {
                var feedbackType = await _feedbackTypeRepo.GetByIdAsync(id) ?? throw new ItemNotFoundException("Feedback type not found");

                feedbackType.MarkDeleted();

                await _feedbackTypeRepo.UpdateAsync(feedbackType,feedbackType.Id);

                return ApiResponse.Success("Feedback Type deleted successfully.");
            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                SerilogLogger.Logger.Error("Failed to delete feedback type", ex);
                return ApiResponse.Error("Failed to delete feedback type.");
            }
        }
    }
}
