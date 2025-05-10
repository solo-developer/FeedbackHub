using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Application
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class DeleteEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IBaseRepository<Domain.Entities.Application> _applicationRepo;
        public DeleteEndpoint(IBaseRepository<Domain.Entities.Application> applicationRepo)
        {
            _applicationRepo = applicationRepo;
        }

        [HttpDelete("/application/{id}")]
        public override Task<IActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var application = await _applicationRepo.GetByIdAsync(id) ?? throw new ItemNotFoundException("Application not found");

                application.MarkDeleted();

                await _applicationRepo.UpdateAsync(application, application.Id);

                return "Application deleted successfully";
            }, "Failed to delete application");
        }

    }
}
