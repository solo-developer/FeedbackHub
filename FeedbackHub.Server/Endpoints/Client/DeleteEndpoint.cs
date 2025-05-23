﻿using Ardalis.ApiEndpoints;
using FeedbackHub.Domain;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Logging;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace FeedbackHub.Server.Endpoints.Client
{
    [Authorize(Roles = Constants.ADMIN_ROLE)]
    public class DeleteEndpoint : EndpointBaseAsync.WithRequest<int>.WithResult<IActionResult>
    {
        private readonly IBaseRepository<Domain.Entities.Client> _clientRepo;
       
        public DeleteEndpoint(IBaseRepository<Domain.Entities.Client> feedbackTypeRepo)
        {
            _clientRepo = feedbackTypeRepo;
        }
        [HttpDelete("/client/{id}")]
        public override Task<IActionResult> HandleAsync(int id, CancellationToken cancellationToken = default)
        {
            return ApiHandler.HandleAsync(async () =>
            {
                var client = await _clientRepo.GetByIdAsync(id) ?? throw new ItemNotFoundException("Client Organization not found");

                client.Disable();

                await _clientRepo.UpdateAsync(client, client.Id);

                return "Client deleted successfully";
            }, "Failed to delete client");
        }

    }
}
