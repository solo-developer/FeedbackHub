namespace FeedbackHub.Domain.Dto.User
{
    public class UpdateApplicationAccessDto
    {
        public int UserId { get; set; }
        public List<int> ApplicationIds { get; set; } = new();
    }
}
