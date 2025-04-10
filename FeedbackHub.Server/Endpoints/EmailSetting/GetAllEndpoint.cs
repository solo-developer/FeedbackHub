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
    public class GetAllEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        private readonly IEmailSettingService _emailSettingService;
        public GetAllEndpoint(IEmailSettingService emailSettingService)
        {
            _emailSettingService =  emailSettingService;
        }

        [HttpGet("/email-setting")]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var emailSetting = await _emailSettingService.GetEmailSettingAsync();

                return ApiResponse.Success(emailSetting);

            }
            catch (CustomException ex)
            {
                ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get email setting", ex);
            }
            return ApiResponse.Error("Failed to get email setting");
        }
    }
}
