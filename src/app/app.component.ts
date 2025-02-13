import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './Services/auth.service';
import { map } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isLoggedIn$!: any;
  searchIsbn: string = '';
  checkRole: any;

  constructor(private myrouter: Router, protected authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.user.pipe(map((user) => !!user));
    this.authService.user.pipe(map((user) => user)).subscribe((user) => {
      this.checkRole = user;
      this.checkRole = this.checkRole.role;
    });
  }

  logout() {
    this.authService.logout();
  }

  findByIsbn(isbn: HTMLInputElement) {
    this.myrouter.navigate(['/books/' + isbn.value]);
    isbn.value = '';
  }
}
