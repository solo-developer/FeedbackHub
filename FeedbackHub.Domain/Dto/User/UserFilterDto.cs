using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto.User
{
    public class UserFilterDto
    {
        public string? Search { get; set; }
        public int Skip { get; set; } = 0;
        public int Take { get; set; } = 20;
        public UserType UserType { get; set; } = UserType.All;

        public int? ClientId { get; set; }
    }
}
