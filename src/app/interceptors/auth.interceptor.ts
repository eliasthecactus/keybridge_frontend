import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Use Angular's `inject` to get the CookieService instance
  const cookieService = inject(CookieService);
  // console.log(req.params)

  // Retrieve the token from cookies
  const token = cookieService.get('token');

  // Clone the request and add the Authorization header if the token exists
  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  // Log the headers for debugging
  // console.log(authReq.headers);
  // console.log(authReq.params)

  // Pass the modified request to the next handler
  return next(authReq);
};
