namespace FeedbackHub.Domain.Dto.User
{
    public class UserDetailDto
    {
        public int Id { get; set; }
        public required string Fullname { get; set; }
        public required string Email { get; set; }
        public int? ClientId { get; set; }
        public string? Client { get; set; }
        public bool IsDeleted { get; set; }
        public List<string> Applications { get; set; } = new();
    }
}
