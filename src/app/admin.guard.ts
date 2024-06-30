import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isloggedInSubject.getValue() && authService.roleSubject.getValue() === 'admin') {
    return true;
  } else {
    router.navigate(['/'])
    return false;
  }
};

