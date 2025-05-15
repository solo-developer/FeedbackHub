namespace FeedbackHub.Domain.Dto.User
{
    public class AdminUserApplicationAccessDto
    {
        public int ClientId { get; set; }
        public List<int> ApplicationIds { get; set; } = new();
    }
}
