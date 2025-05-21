using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Extensions;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Feedback
{
    [Authorize]
    public class GetLinkTypeOptionsEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        [HttpGet("/feedback/link-type-options")]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            var options = EnumExtensions.ToOptions<FeedbackLinkType>();
            return ApiResponse.Success(options);
        }
    }
}
