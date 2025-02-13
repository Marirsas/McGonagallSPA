import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

export const clientGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).hasToken()) {
    let teste: any;
    inject(AuthService)
      .user.pipe(map((user) => user))
      .subscribe((user) => {
        teste = user;
      });
    if (teste.role === 'client') {
      return true;
    }
  }
  Swal.fire({
    icon: 'warning',
    title: 'Access denied: This page is only accessible by registered users!',
    footer: 'McGonagall',
  });
  inject(Router).navigate(['home'], { queryParams: { returnUrl: state.url } });
  return false;
};
