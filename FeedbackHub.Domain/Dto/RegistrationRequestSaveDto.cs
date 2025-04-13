namespace FeedbackHub.Domain.Dto
{
    public class RegistrationRequestSaveDto
    {
        public int ClientId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
    }
}
