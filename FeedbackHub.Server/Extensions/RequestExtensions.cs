using FeedbackHub.Domain.Dto;
using FeedbackHub.Server.Services;

namespace FeedbackHub.Server.Extensions
{
    public static class RequestExtensions
    {
        public static GenericDto<T> ToGenericDto<T>(this T request, IUserContext userContext) where T : class
        {
            var loggedInUserId = userContext.UserId;
            var applicationId = userContext.ApplicationId;
            var clientId = userContext.ClientId;
            var isAdminUser = userContext.IsAdminUser().GetAwaiter().GetResult();

            return new GenericDto<T>
            {
                LoggedInUserId = loggedInUserId.GetValueOrDefault(), 
                ApplicationId = applicationId,
                ClientId = clientId,
                IsAdminUser = isAdminUser,
                Model = request
            };
        }
    }

}
