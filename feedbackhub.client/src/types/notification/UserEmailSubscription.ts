export enum NotificationTriggerStateLevel {
  AllChanges=0,
  Open = 1,
  Closed = 2,
  Declined = 3,
  Resolved = 4,
  OnHold = 5
}

export interface UserFeedbackEmailSubscription {  
  NotifyOnCommentMade: boolean;
  NotifyOnStatusChange: boolean;
  TriggerStates: NotificationTriggerStateLevel[];
  FeedbackTypeIds: number[];
}
