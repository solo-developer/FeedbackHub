using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class ClientService : IClientService
    {
        private readonly IBaseRepository<Domain.Entities.Client> _clientRepo;
        public ClientService(IBaseRepository<Domain.Entities.Client> feedbackTypeRepo)
        {
            _clientRepo = feedbackTypeRepo;
        }

        public async Task<List<ClientDto>> GetAllClientsAsync()
        {
            var clients = await _clientRepo.GetQueryableWithNoTracking().Where(a => a.IsEnabled).ToListAsync();

            return clients.Select(a => new ClientDto
            {
                Id = a.Id,
                Name = a.Name,
                Code = a.Code,
                SubscribedApplications = a.AppSubscriptions.Select(b => new ApplicationDto
                {
                    Id = b.ApplicationId,
                    Name = b.Application.Name,
                    ShortName = b.Application.ShortName,
                    Logo = b.Application.Logo
                }).ToList()
            }).ToList();
        }

        public async Task SaveAsync(ClientSaveDto request)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                if (await IsClientDuplicate(request))
                    throw new DuplicateItemException("Client is already added");
                var client = new Domain.Entities.Client(request.Name, request.Code, request.ApplicationIds);
                await _clientRepo.InsertAsync(client);
                tx.Complete();
            }
        }

        public async Task UpdateAsync(ClientSaveDto request)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                if (await IsClientDuplicate(request))
                    throw new DuplicateItemException("Client is already added");

                var client = await _clientRepo.GetByIdAsync(request.Id) ?? throw new ItemNotFoundException("Client not found.");
                client.Update(request.Name, request.Code, request.ApplicationIds);

                await _clientRepo.UpdateAsync(client,request.Id);

                tx.Complete();
            }
        }

        private async Task<bool> IsClientDuplicate(ClientSaveDto client)
        {
            var clientWithSameDetail = await _clientRepo.FindAsync(a => a.Id != client.Id && a.IsEnabled ==false && a.Code.Equals(client.Code));

            return clientWithSameDetail != null;
        }
    }
}
