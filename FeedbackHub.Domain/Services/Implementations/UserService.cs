using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IBaseRepository<UserDetail> _userRepo;
        public UserService(IBaseRepository<UserDetail> userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task DeleteAsync(int id)
        {
            using(TransactionScope tx=new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var user = await _userRepo.GetByIdAsync(id) ?? throw new ItemNotFoundException("User not found.");

                user.MarkDeleted();
                await _userRepo.UpdateAsync(user, id);
                tx.Complete();
            }
        }

        public async Task<PaginatedDataResponseDto<UserDetailDto>> GetAllUsersAsync(UserFilterDto dto)
        {
            var queryable = _userRepo.GetQueryable();
            if (!string.IsNullOrEmpty(dto.Search))
            {
                queryable = queryable.Where(a => a.FullName.Contains(dto.Search) || a.ApplicationUser.Email.Equals(dto.Search) || a.ApplicationUser.UserName.Equals(dto.Search));
            }
            if (dto.UserType == UserType.Admin)
            {
                queryable = queryable.Where(a => a.RegistrationRequestId == null);
            }
            if (dto.UserType == UserType.Client)
            {
                queryable = queryable.Where(a => a.RegistrationRequestId != null);
            }
            if (dto.ClientId.HasValue)
            {
                queryable = queryable.Where(a => a.RegistrationRequest.ClientId == dto.ClientId);
            }

            var totalCount = await queryable.CountAsync();

            var users = await queryable.Select(a => new UserDetailDto
            {
                Id = a.Id,
                Name = a.FullName,
                Email = a.ApplicationUser.Email,
                Client = a.RegistrationRequest == null ? string.Empty : a.RegistrationRequest.Client.Name,
                IsDeleted = a.IsDeleted,
                Applications = a.Subscriptions.Select(b => b.Application.Name).ToList()
            }).ToListAsync();

            return new PaginatedDataResponseDto<UserDetailDto>
            {
                TotalCount = totalCount,
                Data = users
            };
        }

        public async Task UndoDeleteAsync(int id)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var user = await _userRepo.GetByIdAsync(id) ?? throw new ItemNotFoundException("User not found.");

                user.UndoDelete();
                await _userRepo.UpdateAsync(user, id);
                tx.Complete();
            }
        }
    }
}
