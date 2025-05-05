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
        public override async Task<IActionResult> HandleAsync([FromBody]CreateUserDto request, CancellationToken cancellationToken = default)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    await _userService.CreateAdminUserAsync(request);

                    return ApiResponse.Success("Admin user created successfully. An email will be sent to registered email for login credentials.");
                }
            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to create user", ex);
            }
            return ApiResponse.Error("Failed to create user");
        }
    }
}
