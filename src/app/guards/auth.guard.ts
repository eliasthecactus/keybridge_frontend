import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const utilsService = inject(UtilsService); // Inject UtilsService
  const router = inject(Router); // Inject Router

  return utilsService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        console.log('check2');
        // If not authenticated, navigate to login page
        router.navigate(['/admin/auth'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }),
    catchError((err) => {
      console.log('Error in auth check', err);
      router.navigate(['/admin/auth'], { queryParams: { returnUrl: state.url } });
      return of(false); // Return false in case of error
    })
  );
};
