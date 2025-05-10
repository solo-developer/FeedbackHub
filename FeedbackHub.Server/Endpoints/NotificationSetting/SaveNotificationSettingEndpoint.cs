using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.NotificationSetting
{
    [Authorize(Roles = Constants.CLIENT_ROLE)]
    public class SaveNotificationSettingEndpoint : EndpointBaseAsync.WithRequest<UserNotificationDto>.WithResult<IActionResult>
    {
        private readonly IUserNotificationService _userNotificationService;
        private readonly IUserContext _userContext;
        public SaveNotificationSettingEndpoint(IUserNotificationService userNotificationService, IUserContext userContext)
        {
            _userNotificationService = userNotificationService;
            _userContext = userContext;
        }

        [HttpPost("consumer/notification-settings")]
        public override async Task<IActionResult> HandleAsync([FromBody]UserNotificationDto request, CancellationToken cancellationToken = default)
        {
           return await ApiHandler.HandleAsync(async () =>
           {
              await _userNotificationService.SaveAsync(request.ToGenericDto(_userContext));
               return "Notification setting saved successfully";
           }, "Failed to save notification setting");
        }
    }
}
