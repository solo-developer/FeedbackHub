using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FeedbackHub.Domain.Templating
{
    public class PasswordResetTokenProvider : ITokenValueProvider
    {
        public string? TypeCode => TemplateType.PasswordReset.ToString();

        public async Task<Dictionary<string, string>> GetTokensAsync(object data)
        {
            if (data is not SystemGeneratedPasswordResetDto request)
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
