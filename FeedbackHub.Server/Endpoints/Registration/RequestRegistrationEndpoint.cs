using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Transactions;

namespace FeedbackHub.Server.Endpoints.Registration
{
    [AllowAnonymous]
    public class RequestRegistrationEndpoint : EndpointBaseAsync.WithRequest<RegistrationRequestSaveDto>.WithResult<IActionResult>
    {
        private readonly IBaseRepository<RegistrationRequest> _registrationRequestRepo;
        public RequestRegistrationEndpoint(IBaseRepository<RegistrationRequest> registrationRequestRepo)
        {
            _registrationRequestRepo = registrationRequestRepo;   
        }

        [HttpPost("registration-request")]
        public override async Task<IActionResult> HandleAsync([FromBody] RegistrationRequestSaveDto request, CancellationToken cancellationToken = default)
        {
            return await ApiHandler.HandleAsync(async () =>
            {
                using (var tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var requestEntity = new RegistrationRequest(
                        _registrationRequestRepo,
                        Domain.ValueObjects.Email.Create(request.Email),
                        request.ClientId,
                        request.FullName
                    );

                    await _registrationRequestRepo.InsertAsync(requestEntity);
                    tx.Complete(); 
                }

                return "Registration request submitted successfully."; 
            }, "Failed to submit registration request");
        }

    }
}
