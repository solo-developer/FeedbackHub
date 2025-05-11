export type FilterOption = 'today' | 'last7' | 'last15' | 'last30';


export const filterLabels: Record<FilterOption, string> = {
  today: 'Today',
  last7: 'Last 7 Days',
  last15: 'Last 15 Days',
  last30: 'Last 30 Days',
};