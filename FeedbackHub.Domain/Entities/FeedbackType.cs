namespace FeedbackHub.Domain.Entities
{
    public class FeedbackType : BaseEntity
    {
        protected FeedbackType()
        {
            
        }
        public FeedbackType(string type, string color)
        {
            this.Type = type;
            this.Color = color;
        }
        public string @Type { get;private set; }
        public string Color { get;private set; }

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
