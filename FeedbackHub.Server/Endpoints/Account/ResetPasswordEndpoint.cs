using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class ResetPasswordEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        public ResetPasswordEndpoint(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPatch("/users/{userId}/reset-password")]
        public override Task<IActionResult> HandleAsync(int userId, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                await _userService.ResetPasswordAsync(userId);
                return "User password reset successfully";
            }, "Failed to reset user password");
        }

    }
}
