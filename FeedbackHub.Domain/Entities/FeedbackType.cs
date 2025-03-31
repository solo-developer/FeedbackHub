namespace FeedbackHub.Domain.Entities
{
    public class FeedbackType : BaseEntity
    {
        public required string @Type { get; set; }
        public string Color { get; set; }

        public bool IsDeleted { get;private set; }

        public void MarkDeleted()
        {
            this.IsDeleted= true;
        }
        public void UndoDelete()
        {
            this.IsDeleted= false;  
        }
    }
}
