using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto
{
    public class UserNotificationDto
    {
        public bool NotifyOnCommentMade { get; set; }
        public bool NotifyOnStatusChange { get; set; }
        public List<NotificationTriggerStateLevel> TriggerStates { get; set; } = new();

        public List<int> FeedbackTypeIds { get; set; } = new();

    }
}
