import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User1 } from '../../Models/user1';
import { UsersService } from '../../Services/users.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private addsrv: UsersService,
    private myRouter: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('User data:', this.registerForm.value);
      // Chamar o método para registrar o usuário
      this.registerNewUser();
    }
  }

  registerNewUser() {
    if (this.registerForm.valid) {
      this.addsrv.registerUser(this.registerForm.value).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'New user registered successfully!',
        });
        this.myRouter.navigate(['login']);
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error registering new user! Please try again.',
      });
    }
  }

  loginUser(): void {
    this.myRouter.navigate(['login']);
  }
}
