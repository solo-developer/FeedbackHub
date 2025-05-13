using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.EntityFrameworkCore;

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
                SubscribedApplications= a.AppSubscriptions.Select(b=> new ApplicationDto
                {
                    Id= b.ApplicationId,
                    Name= b.Application.Name,
                    ShortName =b.Application.ShortName,
                    Logo= b.Application.Logo
                }).ToList()
            }).ToList();
        }
    }
}
