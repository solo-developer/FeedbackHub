namespace FeedbackHub.Domain.Dto
{
    public class ClientDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public List<ApplicationDto> SubscribedApplications { get; set; } = new();
    }

    public class ClientSaveDto : ClientDto
    {
        public List<int> ApplicationIds { get; set; } = new();
    }
}
