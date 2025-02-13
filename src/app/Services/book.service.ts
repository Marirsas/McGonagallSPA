import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../Models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  endpoint = 'https://shelfoftales.onrender.com/api/';

  constructor(private myWeb: HttpClient) {}

  get(value?: string): Observable<any[]> {
    return this.myWeb.get<any[]>(this.endpoint + value);
  }

  add(value?: string, any?: any): Observable<any> {
    return this.myWeb.post<any>(this.endpoint + value, any);
  }

  deleteBook(value?: string): Observable<Book> {
    return this.myWeb.delete<Book>(this.endpoint + 'book/' + value);
  }

  updateBook(value?: string, any?: any): Observable<Book> {
    return this.myWeb.put<Book>(this.endpoint + 'book/' + value, any);
  }

  updateBookAvailability(book: Book, isbn: string): Observable<Book> {
    return this.myWeb.patch<Book>(
      this.endpoint + 'book/' + isbn + '/availability',
      book
    );
  }
}
