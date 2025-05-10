using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.EmailSetting
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class SaveEndpoint : EndpointBaseAsync.WithRequest<EmailSettingDto>.WithResult<IActionResult>
    {
        private readonly IEmailSettingService _emailSettingService;
        public SaveEndpoint(IEmailSettingService emailSettingService)
        {
            _emailSettingService = emailSettingService;
        }

        [HttpPost("/email-setting")]
        public override Task<IActionResult> HandleAsync([FromBody] EmailSettingDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                await _emailSettingService.SaveAsync(request);
                return "Email Setting saved successfully"; 
            }, "Failed to save email setting");
        }

    }
}
