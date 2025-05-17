using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class ApplicationService : IApplicationService
    {
        private readonly IBaseRepository<Domain.Entities.Application> _applicationRepo;
        public ApplicationService(IBaseRepository<Domain.Entities.Application> applicationRepo)
        {
            _applicationRepo = applicationRepo;
        }
        public async Task<List<ApplicationDto>> GetAllAsync()
        {
            var applications = await _applicationRepo.GetQueryableWithNoTracking().Where(a => !a.IsDeleted).Select(a => new ApplicationDto
            {
                Id=a.Id,
                Name = a.Name,
                ShortName = a.ShortName,
                Logo = a.Logo
            }).ToListAsync();
            return applications;
        }

        public async Task SaveAsync(ApplicationDto dto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var application = new Application(dto.Name, dto.ShortName, dto.Logo);

                await _applicationRepo.InsertAsync(application);
                tx.Complete();
            }
        }
    }
}
