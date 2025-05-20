namespace FeedbackHub.Domain.Dto.User
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Fullname { get; set; }
        public required string Role { get; set; }
        public string AvatarBase64 { get; set; }
        public string Client { get; set; }

        public List<string> Applications { get; set; } = new();

    }
}
