export function formatDate(date: string): string {
  const dateObj = new Date(date);

  return new Intl.DateTimeFormat('en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    hour12: false,
  }).format(dateObj);
}
