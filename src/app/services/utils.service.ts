import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private cookieService: CookieService,
    private apiService: ApiService,
    private router: Router
  ) {}

  isAuthenticated(): Observable<boolean> {
    const token = this.cookieService.check('token');
    if (!token) {
      return new Observable<boolean>((observer) => {
        observer.next(false); // Token not found, return false
        observer.complete();
      });
    }
    // If token exists, ping the server to verify
    return this.apiService.authPing().pipe(
      map((response) => response.code === 0), // Assuming success code is 0
      catchError(() => {
        return of(false); // In case of error, return false
      })
    );
  }

  logout() {
    this.cookieService.delete('token', '/');
  }

  getAvatarString(string: string, digits: number = 2): string {
    if (!string) return ''; // Handle empty or invalid input

    // Split the name by spaces
    const parts = string.trim().split(/\s+/);
  
    if (digits === 1) {
      // Return the first character of the first word
      return parts[0][0].toUpperCase();
    } else {
      // Combine the first characters of the first `digits` words
      return parts
        .slice(0, digits)
        .map(word => word[0].toUpperCase())
        .join('');
    }
  }

  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

}
