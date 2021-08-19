import bytes from 'byte-size';
import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(new Date(date), 'dd.MM.yyyy HH:mm');
}

export function formatBytes(size: number): string {
  return bytes(size).toString();
}
