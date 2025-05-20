using Microsoft.AspNetCore.Http;

namespace FeedbackHub.Domain.Dto.User
{
    public class UpdateAvatarDto
    {
        public IFormFile Avatar { get; set; }
    }
}
