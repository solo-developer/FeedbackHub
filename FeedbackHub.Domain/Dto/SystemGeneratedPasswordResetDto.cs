using FeedbackHub.Domain.ValueObjects;

namespace FeedbackHub.Domain.Dto
{
    public class SystemGeneratedPasswordResetDto
    {
        public required string FullName { get; set; }
        public required Email Email { get; set; }
        public required string Password { get; set; }
    }
}
