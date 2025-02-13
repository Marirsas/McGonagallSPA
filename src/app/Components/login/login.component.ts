import { Component, OnInit } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { PageLoaderService } from '../../Services/page-loader.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isVisible: boolean = false;
  isAuthorized: boolean = false;
  isLogged: any;

  constructor(
    private fb: FormBuilder,
    private loginServ: AuthService,
    private myRouter: Router,
    private loaderServ: PageLoaderService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginServ.user.pipe(map((user) => user)).subscribe((user) => {
      this.isLogged = user;
    });

    this.loaderServ.isLoading().subscribe({
      next: (x) => (this.isVisible = x),
      error: (err) => console.error(err),
    });
  }

  loginUser(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.loginServ.login(email, password).subscribe({
      next: () => {
        this.isAuthorized = true;
        if (this.isLogged.role == 'client') {
          this.myRouter.navigate(['books/my/recommendations']);
        } else {
          this.myRouter.navigate(['dashboard']);
        }
      },
      error: (error: any) => {
        this.isAuthorized = false;
        this.loaderServ.hideLoader();
        Swal.fire({
          icon: 'error',
          title: 'Login failed! Please check your email and password.',
        });
      },
    });
  }

  registerUser(): void {
    this.myRouter.navigate(['registerUser']);
  }
}
