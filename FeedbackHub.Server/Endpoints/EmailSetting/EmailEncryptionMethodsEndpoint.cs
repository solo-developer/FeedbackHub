using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.EmailSetting
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class EmailEncryptionMethodsEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {

        [HttpGet("email-encryption-methods")]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            var options = EnumExtensions.ToOptions<EmailEncryptionMethod>();
            return ApiResponse.Success(options);
        }
    }
}
