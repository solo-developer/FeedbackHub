using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Services.Implementations;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize]
    public class GetLoggedInUserInfoEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        private readonly IUserContext _userContext;
        public GetLoggedInUserInfoEndpoint(IUserService userService, IUserContext userContext)
        {
            _userContext= userContext;
            _userService= userService;
        }

        [HttpGet("/account/logged-in-user-info")]
        public override Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var userId= _userContext.UserId.Value;
                var profile = await _userService.GetUserProfileAsync(userId);
                return profile;
            }, "Failed to get user profile");
        }
    }
}
