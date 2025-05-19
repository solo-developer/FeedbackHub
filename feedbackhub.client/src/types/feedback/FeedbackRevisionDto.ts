export interface FeedbackChangedFieldDto {
    FieldName: string;
    OldValue: string;
    NewValue: string;
    DisplayName: string; 
}

export interface FeedbackRevisionDto {
    Id: number;
    FeedbackId: number;
    ChangedBy: string;
    ChangedAt: string;
    ChangedFields: FeedbackChangedFieldDto[];
}
