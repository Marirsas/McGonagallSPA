import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { PageLoaderService } from '../Services/page-loader.service';
import { map } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderServ = inject(PageLoaderService);

  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        loaderServ.hideLoader();
      } else {
        loaderServ.showLoader();
      }
      return event;
    })
  );
};
