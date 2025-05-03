namespace FeedbackHub.Domain.Dto
{
    public class GenericDto<T> where T : class
    {
        public int LoggedInUserId { get; set; }
        public int? ApplicationId { get; set; }
        public int? ClientId { get; set; }
        public bool IsAdminUser { get; set; }
        public T Model { get; set; }
    }
}
