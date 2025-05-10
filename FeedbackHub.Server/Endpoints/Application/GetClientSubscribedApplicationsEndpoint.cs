using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public override Task<IActionResult> HandleAsync(CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var userId = _userContext.UserId ?? 0;
                var applications = await _userService.GetSubscriptionsOfUser(userId);
                return applications;
            }, "Failed to get subscribed applications");
        }

    }
}
