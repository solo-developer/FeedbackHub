using FeedbackHub.Domain.Entities;

namespace FeedbackHub.Domain.Repositories.Interface
{
    public interface ITicketSequenceRepository : IBaseRepository<TicketSequence>
    {
        Task<int> GetNewSequenceNumber();
    }
}
