using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Account
{
    public class ChangePasswordEndpoint : EndpointBaseAsync.WithRequest<ChangePasswordDto>
        .WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        private readonly IUserContext _userContext;
        public ChangePasswordEndpoint(IUserService userService, IUserContext userContext)
        {
            _userService = userService;
            _userContext = userContext;
        }

        [HttpPost("/account/change-password")]
        public override async Task<IActionResult> HandleAsync([FromBody]ChangePasswordDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                await _userService.ChangePasswordAsync(request.ToGenericDto(_userContext));

                return "Password changed successfully";
            }, "Failed to change password");
        }
    }
}
