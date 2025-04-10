using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Helpers;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class EmailSettingService : IEmailSettingService
    {
        private readonly IBaseRepository<Setting> _settingRepo;
        private readonly AESEncryptionHelper _aESEncryptionHelper;
        public EmailSettingService(IBaseRepository<Setting> settingRepo, AESEncryptionHelper aESEncryptionHelper)
        {
            _settingRepo = settingRepo;
            _aESEncryptionHelper = aESEncryptionHelper;
        }

        public async Task<EmailSettingDto> GetEmailSettingAsync()
        {
            var emailSettings = await _settingRepo.GetQueryableWithNoTracking().Where(a => a.Group.Equals(Constants.EMAIL_SETTING_GROUP)).ToListAsync();

            var emailHost = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_HOST_SETTINGS_KEY))?.Value;
            var emailPort = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_PORT_SETTINGS_KEY))?.Value;
            var emailEncryptionMethod = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_ENCRYPTION_METHOD_SETTINGS_KEY))?.Value;
            var username = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_USERNAME_SETTINGS_KEY))?.Value;
            var password = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_PASSWORD_SETTINGS_KEY))?.Value;

            return new EmailSettingDto(emailHost, emailPort == default ? 0 : int.Parse(emailPort), emailEncryptionMethod, username, string.IsNullOrEmpty(password) ? string.Empty : _aESEncryptionHelper.Decrypt(password));
        }

        public async Task SaveAsync(EmailSettingDto emailSettingDto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var emailSettings = await _settingRepo.GetQueryable().Where(a => a.Group.Equals(Constants.EMAIL_SETTING_GROUP)).ToListAsync();

                var emailHostSetting = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_HOST_SETTINGS_KEY)) ?? new Setting();
                CopyValues(ref emailHostSetting, Constants.EMAIL_HOST_SETTINGS_KEY, emailSettingDto.Host, Constants.EMAIL_SETTING_GROUP);
                await _settingRepo.AddOrUpdateAsync(emailHostSetting, emailHostSetting.Id);


                var emailPortSetting = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_PORT_SETTINGS_KEY)) ?? new Setting();
                CopyValues(ref emailPortSetting, Constants.EMAIL_PORT_SETTINGS_KEY, emailSettingDto.Port.ToString(), Constants.EMAIL_SETTING_GROUP);
                await _settingRepo.AddOrUpdateAsync(emailPortSetting, emailPortSetting.Id);

                var emailEncryptionMethodSetting = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_ENCRYPTION_METHOD_SETTINGS_KEY)) ?? new Setting();
                CopyValues(ref emailEncryptionMethodSetting, Constants.EMAIL_ENCRYPTION_METHOD_SETTINGS_KEY, emailSettingDto.EncryptionMethod.ToString(), Constants.EMAIL_SETTING_GROUP);
                await _settingRepo.AddOrUpdateAsync(emailEncryptionMethodSetting, emailEncryptionMethodSetting.Id);

                var usernameSetting = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_USERNAME_SETTINGS_KEY)) ?? new Setting();
                CopyValues(ref usernameSetting, Constants.EMAIL_USERNAME_SETTINGS_KEY, emailSettingDto.Username, Constants.EMAIL_SETTING_GROUP);
                await _settingRepo.AddOrUpdateAsync(usernameSetting, usernameSetting.Id);

                var passwordSetting = emailSettings.FirstOrDefault(a => a.Key.Equals(Constants.EMAIL_PASSWORD_SETTINGS_KEY)) ?? new Setting();
                CopyValues(ref passwordSetting, Constants.EMAIL_PASSWORD_SETTINGS_KEY,_aESEncryptionHelper.Encrypt(emailSettingDto.Password), Constants.EMAIL_SETTING_GROUP);
                await _settingRepo.AddOrUpdateAsync(passwordSetting, passwordSetting.Id);

                tx.Complete();
            }
        }

        private void CopyValues(ref Setting setting, string key, string value, string group)
        {
            setting.Key = key;
            setting.Value = value;
            setting.Group = group;
        }
    }
}
