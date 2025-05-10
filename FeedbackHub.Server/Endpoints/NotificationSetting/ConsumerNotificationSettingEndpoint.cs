using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Implementations;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.NotificationSetting
{
    [Authorize(Roles = Constants.CLIENT_ROLE)]
    public class ConsumerNotificationSettingEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        private readonly IUserNotificationService _userNotificationService;
        private readonly IUserContext _userContext;
        public ConsumerNotificationSettingEndpoint(IUserNotificationService userNotificationService, IUserContext userContext)
        {
            _userNotificationService = userNotificationService;
            _userContext = userContext;
        }

        [HttpGet("consumer/notification-settings")]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(GetNotificationSettings,
                       "Failed to get notification setting");
        }

        private async Task<UserNotificationDto> GetNotificationSettings()
        {
            var userId = _userContext.UserId!.Value;
            var appId = _userContext.ApplicationId!.Value;
            var setting = await _userNotificationService.GetSetting(userId, appId);

            return setting;
        }
    }
}
