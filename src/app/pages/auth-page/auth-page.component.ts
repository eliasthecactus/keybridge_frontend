import { Component, ViewChild, ElementRef } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-auth-page',
  imports: [
    ToastModule,
    CheckboxModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    PasswordModule,
    ProgressSpinnerModule,
    CommonModule,
    DividerModule,
    MessageModule
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
  providers: [MessageService, ApiService, CookieService],
})
export class AuthPageComponent {
  public username: string = '';
  public password: string = '';
  isSubmitting: boolean = false;
  showServerDownMessage: boolean = true;

  private returnUrl: string = '/admin/dashboard';

  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkServerStatus();
    // Extract `returnUrl` from query parameters

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.returnUrl;
    console.log('Return URL:', this.returnUrl);
  }

  submit() {
    this.isSubmitting = true; // Disable inputs and show the spinner

    // let userData = { username: 'admin', password: '100%Sport' };
    const userData = {
      username: this.username,
      password: this.password,
    };
    
    this.apiService
      .login(userData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false; // Reset the submission state
        })
      )
      .subscribe(
        (response) => {
          console.log(response.code);
          if (response.code == 0) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Login successful!',
            });

            // Uncomment and use if needed
            // this.cookieService.set('token', response.data.access_token, undefined, '/', undefined, true, 'Lax');
            this.cookieService.set('token', response.data.access_token, undefined, "/", undefined, false, 'Lax');
            // this.cookieService.set('token', response.data.access_token, undefined, undefined, undefined, true, 'None');
            // this.cookieService.set('refresh_token', response.refresh_token, undefined, '/', undefined, true, 'Lax');
            // const accessTokenDecoded = jwtDecode(response.access_token);
            // const refreshTokenDecoded = jwtDecode(response.refresh_token);
            // localStorage.setItem('accesshTokenExpire', accessTokenDecoded['exp']!.toString());
            // localStorage.setItem('refreshTokenExpire', refreshTokenDecoded['exp']!.toString());
            // localStorage.setItem('user_id', response.user);
            this.router.navigateByUrl(this.returnUrl);
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Login failed, please try again.',
          });
        }
      );
  }

  checkServerStatus() {
    this.apiService.ping().subscribe(
      (response) => {
        console.log(response);
        this.showServerDownMessage = false;
      },
      (error) => {
        console.error(error);
        this.showServerDownMessage = true;
      }
    );
  }
}
