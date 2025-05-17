using FeedbackHub.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace FeedbackHub.Domain.Entities
{
    public class FeedbackChangedField : BaseEntity
    {
        public FeedbackChangedField() { }

        public FeedbackChangedField(string fieldName, string oldValue, string newValue)
        {
            FieldName = fieldName;
            OldValue = oldValue;
            NewValue = newValue;
        }

        public int FeedbackRevisionId { get; set; }

        public string FieldName { get;private set; }
        public string OldValue { get;private set; }
        public string NewValue { get;private set; }

        public virtual FeedbackRevision FeedbackRevision { get; set; }

        public string GetDisplayName()
        {
            var field = typeof(TrackedField).GetField(FieldName.ToString());
            var attr = field?.GetCustomAttributes(typeof(DisplayAttribute), false)
                             .FirstOrDefault() as DisplayAttribute;
            return attr?.Name ?? FieldName.ToString();
        }
    }

}
