using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Extensions;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize]
    public class UpdateAvatarEndpoint : EndpointBaseAsync.WithRequest<UpdateAvatarDto>.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        private readonly IUserContext _userContext;
        public UpdateAvatarEndpoint(IUserService userService, IUserContext userContext)
        {
            _userService = userService;
            _userContext = userContext;
        }

        [HttpPatch("/account/avatar")]
        public override async Task<IActionResult> HandleAsync([FromForm]UpdateAvatarDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                 await _userService.UpdateAvatarAsync(request.ToGenericDto(_userContext));
                return "Avatar updated successfully";
            }, "Failed to update avatar");
        }
    }
}
