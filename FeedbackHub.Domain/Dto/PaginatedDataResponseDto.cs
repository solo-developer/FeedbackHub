namespace FeedbackHub.Domain.Dto
{
    public class PaginatedDataResponseDto<T> where T:class
    {
        public int TotalCount { get; set; }
        public List<T> Data { get; set; }
    }
}
