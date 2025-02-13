import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { User1 } from '../Models/user1';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private endpoint = 'https://shelfoftales.onrender.com/api/user/';
  private userSubject = new BehaviorSubject<User1 | null>(null);
  public user: Observable<User1 | null>;

  constructor(private http: HttpClient, private tokenSrv: TokenService) {
    if (this.tokenSrv.hasToken('user')) {
      this.userSubject.next(JSON.parse(this.tokenSrv.getToken('user')));
    }
    this.user = this.userSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.endpoint}signin`, { email, password })
      .pipe(
        map((user) => {
          this.tokenSrv.saveToken('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        }),
        catchError(this.handleError<User1>('login'))
      );
  }

  logout() {
    this.tokenSrv.deleteToken('user');
    this.userSubject.next(null);
  }

  hasToken() {
    return this.tokenSrv.hasToken('user');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.logout();
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(error.message));
    };
  }

  getUser(): Observable<User1> {
    return this.http.get<User1>(this.endpoint);
  }
}
