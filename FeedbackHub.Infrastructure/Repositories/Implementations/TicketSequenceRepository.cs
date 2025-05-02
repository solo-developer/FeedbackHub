using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Infrastructure.Context;
using FeedbackHub.Infrastructure.Repository.Implementations;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.Repositories.Implementations
{
    public class TicketSequenceRepository : BaseRepository<TicketSequence>, ITicketSequenceRepository
    {
        private readonly AppDbContext _context;
        public TicketSequenceRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<int> GetNewSequenceNumber()
        {
            var sequence = await _context.TicketSequences
                .FromSqlRaw("SELECT * FROM TicketSequences WITH (UPDLOCK, ROWLOCK)")
                .FirstOrDefaultAsync();

            if (sequence == null)
            {
                sequence = new TicketSequence { SequenceNo = 1 };
                _context.TicketSequences.Add(sequence);
            }
            else
            {
                sequence.SequenceNo += 1;
                _context.TicketSequences.Update(sequence);
            }

            await _context.SaveChangesAsync();

            return sequence.SequenceNo;
        }
    }
}
