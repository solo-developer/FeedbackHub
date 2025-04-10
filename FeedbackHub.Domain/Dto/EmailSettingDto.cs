using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;

namespace FeedbackHub.Domain.Dto
{
    public class EmailSettingDto
    {
        public EmailSettingDto() { }
        public EmailSettingDto(string host, int port, string encryptionMethod, string username, string password)
        {
            this.Host = host;
            this.Port = port;
            this.Username = username;
            this.Password = password;
            if (Enum.IsDefined(typeof(EmailEncryptionMethod), encryptionMethod)) throw new InvalidValueException("Value of encryption method is invalid.");
            this.EncryptionMethod =(EmailEncryptionMethod) Enum.Parse(typeof(EmailEncryptionMethod), encryptionMethod);
        }
        public string Host { get; protected set; }
        public  int Port { get; protected set; }
        public EmailEncryptionMethod EncryptionMethod { get;protected set; }

        public string Username { get;protected set; }
        public string Password { get;protected set; }
    }
}
