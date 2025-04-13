using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto
{
    public class RegistrationRequestFilterDto
    {
        public int? State { get; set; }
        public string? Search { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; } = 10;
    }
}
