namespace FeedbackHub.Domain.Dto
{
    public class ConvertRegistrationRequestToUserDto
    {
        public int RegistrationRequestId { get; set; }
        public string Password { get; set; }

        public List<int> ApplicationIds { get; set; } = new List<int>();
    }
}
