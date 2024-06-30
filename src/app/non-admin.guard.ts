import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const nonAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.roleSubject.getValue() !== 'admin') {
    return true;
  } else {
    router.navigate(['/'])
    return false;
  }
};
