using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Implementations;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Attachment
{
    [Authorize]
    public class RemoveAttachmentEndpoint : EndpointBaseAsync.WithRequest<string>.WithResult<IActionResult>
    {
        private readonly IAttachmentService _attachmentService;
        public RemoveAttachmentEndpoint(IAttachmentService attachmentService)
        {
            _attachmentService = attachmentService;
        }

        [HttpDelete("/attachments/{identifier}/remove")]
        public override Task<IActionResult> HandleAsync(string identifier, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                await _attachmentService.RemoveAsync(identifier);
                return "Attachment removed successfully";
            }, "Failed to remove attachment");
        }

    }
}
