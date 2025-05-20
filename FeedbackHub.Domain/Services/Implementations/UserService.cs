using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Helpers;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using FeedbackHub.Domain.Templating;
using FeedbackHub.Domain.ValueObjects;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using System.Reflection.Emit;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IBaseRepository<UserDetail> _userRepo;
        private readonly IEmailContentComposer _emailContentComposerService;
        private readonly IEmailSenderService _emailSenderService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IFileHelper _fileHelper;

        public UserService(IBaseRepository<UserDetail> userRepo, IEmailContentComposer emailContentComposer, IEmailSenderService emailSenderService, UserManager<ApplicationUser> userManager, IFileHelper fileHelper)
        {
            _userRepo = userRepo;
            _emailContentComposerService = emailContentComposer;
            _emailSenderService = emailSenderService;
            _userManager = userManager;
            _fileHelper = fileHelper;
        }

        public async Task ChangePasswordAsync(GenericDto<ChangePasswordDto> dto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                if (dto.Model.IsPasswordMatch == false) throw new InvalidValueException("New password and confirm password doesn't match.");
                var userDetail = await _userRepo.FindAsync(a => a.Id == dto.LoggedInUserId);

                var isPasswordCorrect = await _userManager.CheckPasswordAsync(userDetail.ApplicationUser, dto.Model.CurrentPassword);
                if (!isPasswordCorrect) throw new InvalidValueException("Current password doesn't match.");

                var updatePassword = await _userManager.ChangePasswordAsync(userDetail.ApplicationUser, dto.Model.CurrentPassword, dto.Model.NewPassword);
                if (updatePassword.Succeeded == false)
                {
                    throw new CustomException(updatePassword.Errors.FirstOrDefault().Description);
                }
                tx.Complete();
            }
        }

        public async Task CreateAdminUserAsync(CreateUserDto dto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var userDetail = UserDetail.CreateAdminUser(dto.FullName, dto.Email, dto.Accesses);

                var appUser = userDetail.ApplicationUser;
                var result = await _userManager.CreateAsync(appUser, dto.Password);
                if (!result.Succeeded) throw new Exception("User creation failed");

                var roleAdditionResult = await _userManager.AddToRoleAsync(appUser, Constants.ADMIN_ROLE);

                if (!roleAdditionResult.Succeeded)
                    throw new Exception("There were some issues in assigning role to the user");

                await _userRepo.InsertAsync(userDetail);

                tx.Complete();
            }

            var (subject, body) = await _emailContentComposerService.ComposeAsync(TemplateType.AccountCreated, dto);

            _emailSenderService.SendEmailAsync(new EmailMessageDto
            {
                Body = body,
                Subject = subject,
                IsHtml = true,
                To = new List<string> { dto.Email.Value }
            });
        }

        public async Task DeleteAsync(int id)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
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

            var users = await queryable.OrderBy(a => a.ApplicationUser.Email).Skip(dto.Skip).Take(dto.Take).Select(a => new UserDetailDto
            {
                Id = a.Id,
                Fullname = a.FullName,
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

        public async Task<int> GetAspUserByUserDetailId(int userDetailId)
        {
            var user = await _userRepo.GetQueryableWithNoTracking().SingleOrDefaultAsync(a => a.Id == userDetailId) ?? throw new ItemNotFoundException("User not found");

            return user.AppUserId;
        }

        public async Task<List<ApplicationDto>> GetSubscriptionsOfUser(int userId)
        {
            var user = await _userRepo.GetQueryableWithNoTracking().SingleOrDefaultAsync(a => a.Id == userId) ?? throw new ItemNotFoundException("User not found");

            return user.Subscriptions.Select(a => new ApplicationDto
            {
                Id = a.ApplicationId,
                Name = a.Application.Name,
                ShortName = a.Application.ShortName,
                Logo = a.Application.Logo
            }).ToList();
        }

        public async Task<UserDetailDto> GetUserDetailByAspUserIdAsync(int aspUserId)
        {
            var user = await _userRepo.GetQueryableWithNoTracking().Where(a => a.AppUserId == aspUserId).Select(a => new UserDetailDto
            {
                Id = a.Id,
                Fullname = a.FullName,
                Email = a.ApplicationUser.Email,
                Client = a.RegistrationRequest == null ? string.Empty : a.RegistrationRequest.Client.Name,
                ClientId = a.RegistrationRequest == null ? null : a.RegistrationRequest.ClientId,
                IsDeleted = a.IsDeleted,
                Applications = a.Subscriptions.Select(b => b.Application.Name).ToList()
            }).FirstOrDefaultAsync();

            return user;
        }

        public async Task<List<GenericDropdownDto<int, string>>> GetUserDropdownOptions(bool includeDeleted = false)
        {
            return await _userRepo.GetQueryableWithNoTracking().Where(a => includeDeleted || a.IsDeleted == false).Select(a => new GenericDropdownDto<int, string>
            {
                Label = a.FullName,
                Value = a.Id
            }).ToListAsync();
        }

        public async Task<UserProfileDto> GetUserProfileAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId) ?? throw new ItemNotFoundException("User not found.");

            var userProfile = new UserProfileDto
            {
                Id = user.Id,
                Username = user.ApplicationUser.UserName,
                Email = user.ApplicationUser.Email,
                Fullname = user.FullName,
                AvatarBase64=string.IsNullOrEmpty(user.AvatarUrl) ? null: _fileHelper.GetBase64StringOfImageFile(Constants.USER_AVATAR_FOLDER,user.AvatarUrl),
                Role = (await _userManager.GetRolesAsync(user.ApplicationUser)).FirstOrDefault(),
                Client = user.RegistrationRequest == null ? string.Empty : user.RegistrationRequest.Client.Name,
                Applications = user.Subscriptions.Select(a => a.Application.Name).ToList()
            };

            return userProfile;
        }

        public async Task ResetPasswordAsync(int id)
        {
            var newPassword = PasswordGenerator.GeneratePassword();
            var user = await _userRepo.GetByIdAsync(id) ?? throw new ItemNotFoundException("User not found.");
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {

                user.ChangePassword(newPassword);
                await _userRepo.UpdateAsync(user, id);
                tx.Complete();
            }

            var emailData = new SystemGeneratedPasswordResetDto
            {
                FullName = user.FullName,
                Email = Email.Create(user.ApplicationUser.Email),
                Password = newPassword
            };
            var (subject, body) = await _emailContentComposerService.ComposeAsync(TemplateType.PasswordReset, emailData);

            _emailSenderService.SendEmailAsync(new EmailMessageDto
            {
                Body = body,
                Subject = subject,
                IsHtml = true,
                To = new List<string> { user.ApplicationUser.Email }
            });

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

        public async Task UpdateAvatarAsync(GenericDto<UpdateAvatarDto> dto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var fileName = await _fileHelper.SaveFileAsync(dto.Model.Avatar, Constants.USER_AVATAR_FOLDER);

                var user = await _userRepo.GetByIdAsync(dto.LoggedInUserId) ?? throw new ItemNotFoundException("User not found.");

                if (!string.IsNullOrEmpty(user.AvatarUrl))
                {
                  await _fileHelper.DeleteFileAsync(Constants.USER_AVATAR_FOLDER, user.AvatarUrl);
                }
                user.UpdateAvatar(fileName);

                await _userRepo.UpdateAsync(user, dto.LoggedInUserId);
                tx.Complete();
            }
        }
    }
}
