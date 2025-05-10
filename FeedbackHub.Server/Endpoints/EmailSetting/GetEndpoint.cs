using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.EmailSetting
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class GetEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        private readonly IEmailSettingService _emailSettingService;
        public GetEndpoint(IEmailSettingService emailSettingService)
        {
            _emailSettingService = emailSettingService;
        }

        [HttpGet("/email-setting")]
        public override Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var emailSetting = await _emailSettingService.GetEmailSettingAsync();
                return emailSetting; 
            }, "Failed to get email setting"); 
        }

    }
}
