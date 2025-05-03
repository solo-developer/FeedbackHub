using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Domain.Templating
{
    public class RegistrationRequestApprovedTokenProvider : ITokenValueProvider
    {
        private readonly IBaseRepository<RegistrationRequest> _registrationRequestRepo;
        private readonly IBaseRepository<Application> _applicationRepo;
        public RegistrationRequestApprovedTokenProvider(IBaseRepository<RegistrationRequest> registrationRequestRepo, IBaseRepository<Application> applicationRepo)
        {

            _registrationRequestRepo = registrationRequestRepo;
            _applicationRepo = applicationRepo;
        }
        public string? TypeCode => TemplateType.RegistrationRequestAccepted.ToString();

        public async Task<Dictionary<string, string>> GetTokensAsync(object data)
        {
            if (data is not ConvertRegistrationRequestToUserDto request)
                throw new InvalidValueException("Parameter mismatch");

            var registrationRequest = await _registrationRequestRepo.FindAsync(a => a.Id == request.RegistrationRequestId);

            var applications = await _applicationRepo.GetQueryableWithNoTracking().Where(a => request.ApplicationIds.Contains(a.Id)).Select(a => new
            {
                a.Name,
                a.ShortName
            }).ToListAsync();

            return new Dictionary<string, string>
            {
                ["UserName"] = registrationRequest.FullName,
                ["Email"] = registrationRequest.Email.Value,
                ["Password"] = request.Password,
                ["Applications"] = string.Join(",", applications.Select(a => $"{a.Name}({a.ShortName}) ")),
            };
        }
    }
}
