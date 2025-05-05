using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;

namespace FeedbackHub.Domain.Templating
{
    public class AccountCreatedTokenProvider : ITokenValueProvider
    {
        public string? TypeCode => TemplateType.AccountCreated.ToString();

        public async Task<Dictionary<string, string>> GetTokensAsync(object data)
        {
            if (data is not CreateUserDto request)
                throw new InvalidValueException("Parameter mismatch");


            return new Dictionary<string, string>
            {
                ["UserName"] = request.FullName,
                ["Email"] = request.Email.Value,
                ["Password"] = request.Password,
            };
        }
    }
}
