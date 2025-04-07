using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IClientService
    {
        Task<List<ClientDto>> GetAllClientsAsync();
    }
}
