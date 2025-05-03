using FeedbackHub.Domain.ValueObjects;

namespace FeedbackHub.Domain.Dto.User
{
    public class RegistrationRequestDto
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required bool IsUser { get; set; }
        public required DateTime RequestedAt { get; set; }
        public required Email Email { get; set; }
        public required ClientDto Client { get; set; }
    }
}
