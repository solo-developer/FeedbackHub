using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Application
{
    [Authorize(Roles =Constants.CLIENT_ROLE)]
    public class GetClientSubscribedApplicationsEndpoint : EndpointBaseAsync.WithoutRequest.WithResult<IActionResult>
    {
        private readonly IUserContext _userContext;
        private readonly IUserService _userService;
        public GetClientSubscribedApplicationsEndpoint(IUserContext userContext,IUserService userService)
        {
            _userContext = userContext;
            _userService = userService;
        }

        [HttpGet("/consumer/applications")]
        public override async Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {           
            try
            {
                var userId = _userContext.UserId;

                var applications =await _userService.GetSubscriptionsOfUser(userId ?? 0);


                return ApiResponse.Success(applications);
            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to get subscribed applications", ex);
                return ApiResponse.Error("Failed to get subscribed applications");
            }
        }
    }
}
