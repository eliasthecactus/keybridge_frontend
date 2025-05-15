import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ApiService } from '../../../../services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { Application } from '../../../../interfaces/application';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-applications-page',
  imports: [
    CommonModule,
    FormsModule,
    TagModule,
    ButtonModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    ToastModule,
    SidebarModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    AvatarModule
  ],
  templateUrl: './applications-page.component.html',
  styleUrl: './applications-page.component.css',
  providers: [ApiService, MessageService],
})
export class ApplicationsPageComponent {
  apps: Application[];
  selectedApplication: Application | null = null;
  showSideBar: boolean = false;
  loadingApplications: boolean = false;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
        private utilsService: UtilsService
  ) {
    this.apps = [];
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.loadingApplications = true;
    this.apiService.getApplication().subscribe(
      (response) => {
        console.log(response);
        this.apps = response.data;
        this.loadingApplications = false;
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching applications',
        });
        this.apps = [];
      }
    );
  }

  editApplication(app: Application): void {
    // this.selectedApplication = { ...app };
    this.router.navigate(
      ['application', app.id],
      { relativeTo: this.route }
    );
  }

  addApplication(): void {
    this.router.navigate(['application', 'new'], { relativeTo: this.route });
    console.log('add application');
  }

  getAvatarString(string: string, digits: number): string {
    return this.utilsService.getAvatarString(string, digits);
  }
}
