using Ardalis.ApiEndpoints;
using Azure.Core;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class GetUserDropdownEndpoint : EndpointBaseAsync.WithRequest<bool>.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        public GetUserDropdownEndpoint(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("/user-options")]
        public override async Task<IActionResult> HandleAsync([FromQuery] bool includeDeleted = false, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                var data = await _userService.GetUserDropdownOptions(includeDeleted);

                return data;
            }, "Failed to get users");
        }
    }
}
