import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import Swal from 'sweetalert2';

export const authenticationGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).hasToken()) {
    return true;
  }
  Swal.fire({
    icon: 'warning',
    title: 'Access denied: This page is only accessible by registered users!',
    footer: 'McGonagall',
  });
  inject(Router).navigate(['login'], { queryParams: { returnUrl: state.url } });
  return false;
};
