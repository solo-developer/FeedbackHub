using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class UndoDeleteUserEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        public UndoDeleteUserEndpoint(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPatch("/users/{userId}/restore")]
        public override Task<IActionResult> HandleAsync(int userId, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                await _userService.UndoDeleteAsync(userId);
                return "User restored successfully";
            }, "Failed to restore user");
        }

    }
}
