using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class UpdateApplicationAccessEndpoint : EndpointBaseAsync.WithRequest<UpdateApplicationAccessDto>.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        public UpdateApplicationAccessEndpoint(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("/user/application-access")]
        public override  Task<IActionResult> HandleAsync([FromBody]UpdateApplicationAccessDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                if (!ModelState.IsValid)
                {
                    throw new CustomException("Invalid input data.");
                }

                await _userService.UpdateApplicationAccessAsync(request);

                return "Application Access updated successfully";
            }, "Failed to update application access");
        }
    }
}
