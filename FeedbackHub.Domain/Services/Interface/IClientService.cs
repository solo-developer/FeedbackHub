using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IClientService
    {
        Task<List<ClientDto>> GetAllClientsAsync();
        Task SaveAsync(ClientSaveDto dto);
        Task UpdateAsync(ClientSaveDto dto);
    }
}
