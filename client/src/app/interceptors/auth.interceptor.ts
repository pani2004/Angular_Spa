import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token might be expired, try to refresh
        if (!req.url.includes('/auth/refresh')) {
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Retry the original request
              return next(req);
            }),
            catchError((refreshError) => {
              // Refresh failed, redirect to login
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // Refresh token is also invalid, redirect to login
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
