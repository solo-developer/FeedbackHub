using FeedbackHub.Domain.ValueObjects;

namespace FeedbackHub.Domain.Dto.User
{
    public class CreateUserDto
    {
        public required string FullName { get; set; }

        public required Email Email { get; set; }

        public required string Password { get; set; }
    }
}
