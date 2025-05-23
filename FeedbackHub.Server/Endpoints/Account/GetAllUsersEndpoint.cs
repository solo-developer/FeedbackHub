﻿using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Account
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class GetAllUsersEndpoint : EndpointBaseAsync.WithRequest<UserFilterDto>.WithResult<IActionResult>
    {
        private readonly IUserService _userService;
        public GetAllUsersEndpoint(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("/users")]
        public override Task<IActionResult> HandleAsync([FromBody] UserFilterDto request, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var data = await _userService.GetAllUsersAsync(request);
                return data;
            }, "Failed to get users");
        }

    }
}
