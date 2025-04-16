using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Services.Interface;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Mail;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class EmailSenderService : IEmailSenderService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public EmailSenderService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public async Task SendEmailAsync(EmailMessageDto message)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();

                var settingService = scope.ServiceProvider.GetRequiredService<IEmailSettingService>();
                var mailSetting = await settingService.GetEmailSettingAsync();

                var senderEmail = mailSetting.Username;
                if (string.IsNullOrEmpty(senderEmail))
                    throw new ItemNotFoundException("Email setting is not saved.");

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail),
                    Subject = message.Subject,
                    Body = message.Body,
                    IsBodyHtml = message.IsHtml
                };

                foreach (var recipient in message.To)
                {
                    mailMessage.To.Add(recipient);
                }

                var smtpClient = new SmtpClient(mailSetting.Host, mailSetting.Port)
                {
                    Credentials = new NetworkCredential(mailSetting.Username, mailSetting.Password),
                    EnableSsl = true
                };

                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                // Log or handle the error appropriately
                throw;
            }
        }
    }

}
