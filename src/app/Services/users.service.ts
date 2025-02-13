import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User1 } from '../Models/user1';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  theEndpoint = 'https://shelfoftales.onrender.com/api/user/signup';
  constructor(private myWebApiClient: HttpClient) {}

  registerUser(newUser: User1): Observable<any> {
    return this.myWebApiClient.post<any>(this.theEndpoint, newUser);
  }
}
