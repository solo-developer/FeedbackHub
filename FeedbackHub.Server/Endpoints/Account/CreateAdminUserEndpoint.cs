using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class CreateAdminUserEndpoint : EndpointBaseAsync.WithRequest<CreateUserDto>.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        public CreateAdminUserEndpoint(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("/admin/user")]
        public override Task<IActionResult> HandleAsync([FromBody] CreateUserDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                if (!ModelState.IsValid)
                {
                    throw new CustomException("Invalid input data.");
                }

                await _userService.CreateAdminUserAsync(request);

                return "Admin user created successfully. An email will be sent to the registered email for login credentials.";
            }, "Failed to create user");
        }

    }
}
