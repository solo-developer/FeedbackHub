using Ardalis.ApiEndpoints;
using Azure.Core;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize(Roles =Constants.ADMIN_ROLE)]
    public class DeleteUserEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        public DeleteUserEndpoint(IUserService userService)
        {
            _userService = userService;
        }

        [HttpDelete("/users/{userId}")]
        public override Task<IActionResult> HandleAsync(int userId, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                await _userService.DeleteAsync(userId);
                return "User deleted successfully";
            }, "Failed to delete user");
        }

    }
}
