export enum TicketStatus {
    Open = 1,
    Closed = 2,
    Declined = 3,    
    Resolved = 4,
    OnHold=5
  }
  
  
export const TicketStatusLabels: Record<TicketStatus, string> = {
  [TicketStatus.Open]: 'Open',
  [TicketStatus.Closed]: 'Closed',
  [TicketStatus.Declined]: 'Declined',
  [TicketStatus.Resolved]: 'Resolved',
  [TicketStatus.OnHold]: 'On Hold',
};