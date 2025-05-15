import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-setup',
  imports: [
    ToastModule,
    ButtonModule,
    CardModule,
    DividerModule,
    CommonModule,
    FormsModule,
    PasswordModule,
  ],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css',
  providers: [MessageService, ApiService],
})
export class SetupComponent {
  isSubmitting: boolean = false;
  password: string = '';


  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  submit() {
    this.isSubmitting = true; // Disable inputs and show the spinner

    const data = {
      password: this.password,
    };

    this.apiService
      .setup(data)
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
            this.router.navigate(['/admin/auth']);
          }
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        }
      );
  }
}
