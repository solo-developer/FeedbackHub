
export interface UnlinkFeedbackDto {
  SourceId : number;
  TargetId : number;
}

export  interface LinkFeedbackDto extends UnlinkFeedbackDto{
  LinkType : number;
}