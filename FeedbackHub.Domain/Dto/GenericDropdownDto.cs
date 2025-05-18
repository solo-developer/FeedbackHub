namespace FeedbackHub.Domain.Dto
{
    public class GenericDropdownDto<Tvalue,Tlabel>
    {
        public required Tlabel Label { get; set; }
        public required Tvalue Value { get; set; }
    }
}
