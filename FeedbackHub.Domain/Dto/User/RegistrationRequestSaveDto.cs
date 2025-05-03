namespace FeedbackHub.Domain.Dto.User
{
    public class RegistrationRequestSaveDto
    {
        public int ClientId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }
}
