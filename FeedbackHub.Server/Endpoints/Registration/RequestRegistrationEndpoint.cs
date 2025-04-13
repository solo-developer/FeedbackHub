using Ardalis.ApiEndpoints;
using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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
        public override async Task<IActionResult> HandleAsync([FromBody]RegistrationRequestSaveDto request, CancellationToken cancellationToken = default)
        {
            try
            {
                using(TransactionScope tx= new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
                {
                    var requestEntity = new RegistrationRequest(_registrationRequestRepo, Domain.ValueObjects.Email.Create(request.Email), request.ClientId, request.FullName);

                    await _registrationRequestRepo.InsertAsync(requestEntity);
                    tx.Complete();
                }
               
                return ApiResponse.Success("Registration request submitted successfully.");

            }
            catch (CustomException ex)
            {
                return ApiResponse.Info(ex.Message);
            }
            catch (Exception ex)
            {
                Log.Error("Failed to submit registration request", ex);
            }
            return ApiResponse.Error("Failed to submit registration request");
        }
    }
}
