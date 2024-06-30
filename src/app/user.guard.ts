import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isloggedInSubject.getValue() && authService.roleSubject.getValue() === 'user') {
    return true;
  } else {
    router.navigate(['/'])
    return false;
  }
};
