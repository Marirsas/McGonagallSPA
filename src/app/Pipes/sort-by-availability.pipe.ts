import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByAvailability',
  pure: true, // Mantém a performance
  standalone: true,
})
export class SortByAvailabilityPipe implements PipeTransform {
  transform(books: any[]): any[] {
    if (!books || !Array.isArray(books)) {
      return [];
    }

    if (books.length <= 1) {
      return books;
    }

    return [...books].sort((a, b) => {
      return (b.available ? 1 : 0) - (a.available ? 1 : 0);
    });
  }
}
