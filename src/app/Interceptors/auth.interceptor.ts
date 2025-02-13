import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { TokenService } from '../Services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (inject(AuthService).hasToken()) {
    const theToken = JSON.parse(inject(TokenService).getToken('user'));
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${theToken.token}`),
    });
    return next(authRequest);
  }
  return next(req);
};
