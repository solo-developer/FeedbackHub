namespace FeedbackHub.Domain.Dto
{
    public class UserDetailDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
