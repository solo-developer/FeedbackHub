using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

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
        public override async Task<IActionResult> HandleAsync(int userId, CancellationToken cancellationToken = default)
        {
            try
            {
                await _userService.ResetPasswordAsync(userId);

                return ApiResponse.Success("User password reset successfully");
            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to reset user password", ex);
            }
            return ApiResponse.Error("Failed to reset user password");
        }
    }
}
