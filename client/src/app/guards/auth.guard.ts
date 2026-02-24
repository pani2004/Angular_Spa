import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserRole } from '../models/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'] as UserRole;

  if (!authService.isLoggedIn) {
    return router.createUrlTree(['/login']);
  }

  if (requiredRole && authService.currentUserValue?.role !== requiredRole) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
