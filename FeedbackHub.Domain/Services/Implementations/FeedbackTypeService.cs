using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class FeedbackTypeService : IFeedbackTypeService
    {
        private readonly IBaseRepository<Domain.Entities.FeedbackType> _feedbackTypeRepo;
        public FeedbackTypeService(IBaseRepository<Domain.Entities.FeedbackType> feedbackTypeRepo)
        {
            _feedbackTypeRepo = feedbackTypeRepo;
        }
        public async Task<List<FeedbackTypeDto>> GetFeedbackTypesAsync()
        {
            var feedbackTypes = await _feedbackTypeRepo.GetQueryableWithNoTracking().Where(a => !a.IsDeleted).ToListAsync();

            return feedbackTypes.Select(a=> new FeedbackTypeDto { 
                @Type = a.Type,
                Color = a.Color
            }).ToList();

        }
    }
}
