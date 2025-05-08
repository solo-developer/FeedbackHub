/**
 * Converts an ISO date string to 'yyyy-MM-dd hh:mm AM/PM' format.
 * @param input - ISO date string (e.g., '2025-05-03T00:41:41.5841312')
 * @returns formatted string
 */
export function formatToCustomDateTime(input: string): string {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      return ''; // handle invalid date
    }
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hourStr = String(hours).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hourStr}:${minutes} ${ampm}`;
  }
  