using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

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
        public override async Task<IActionResult> HandleAsync([FromBody] EmailSettingDto request, CancellationToken cancellationToken = default)
        {
            try
            {
                await _emailSettingService.SaveAsync(request);

                return ApiResponse.Success("Email Setting saved successfully");

            }
            catch (CustomException ex)
            {
                ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to save email setting", ex);
            }
            return ApiResponse.Error("Failed to save email setting");
        }
    }
}
