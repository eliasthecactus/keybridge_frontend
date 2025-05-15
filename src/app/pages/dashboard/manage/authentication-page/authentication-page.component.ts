import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { LdapServer } from '../../../../interfaces/ldap-server';
import { ApiService } from '../../../../services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-authentication-page',
  imports: [
    CommonModule,
    FormsModule,
    TagModule,
    ButtonModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    ToastModule,
    DrawerModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    BadgeModule,
    SelectModule
  ],
  templateUrl: './authentication-page.component.html',
  styleUrl: './authentication-page.component.css',
  providers: [ApiService, MessageService],
})
export class AuthenticationPageComponent implements OnInit {
  servers: LdapServer[];
  selectedServer: LdapServer | null = null;
  showSideBar: boolean = false;

  availableServers: number[] = [];

  serverTypes = [
    { label: 'LDAP', value: 'ldap' },
    { label: 'AD LDAP', value: 'ad' }
];


  constructor(private apiService: ApiService, private messageService: MessageService) {
    this.servers = [];
    this.fetchLDAPServers();
  }

  ngOnInit() {
    // this.servers = this.fetchLDAPServers();
  }

  fetchLDAPServers(): void {
    this.updateServerAvailability()
    this.apiService.getAuthSource().subscribe(
      (response) => {
        console.log(response);
        this.servers = response.data;
        this.updateServerAvailability();
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching auth servers',
        });
        this.servers = [];
      }
    );
  }

  editServer(server: LdapServer): void {
    this.selectedServer = { ...server }; // Make a copy to avoid direct mutation
    this.showSideBar = true;
  }

  saveServer(): void {
    if (this.selectedServer) {
      if (this.selectedServer.id == -1) {
        // console.log("new server selected");
        this.apiService.addAuthSource(this.selectedServer).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Server '${this.selectedServer?.name}' added successfully.`,
            });
            this.showSideBar = false;
            this.fetchLDAPServers();
          },
          (error) => {
            console.error('Error adding server:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to add server '${this.selectedServer?.name}'.`,
            });
          }
        );
      } else {
        this.apiService.updateAuthSource(this.selectedServer).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Server '${this.selectedServer?.name}' updated successfully.`,
            });
            this.showSideBar = false;
            this.fetchLDAPServers(); // Refresh the list
          },
          (error) => {
            console.error('Error updating server:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to update server '${this.selectedServer?.name}'.`,
            });
          }
        );
      }

    }
  }
  testAuthSource() {
    if (this.selectedServer) {
      this.apiService.testAuthSource(this.selectedServer).subscribe(
        (response) => {
          console.log(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Test successful',
          });
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        }
      );

    }
  }

  cancelEdit(): void {
    this.selectedServer = null;
    this.showSideBar = false;
  }

  deleteAuthSource() {
    if (
      confirm(
        `Are you sure you want to delete the auth server "${this.selectedServer?.name}"?`
      )) {
        if (this.selectedServer) {
          this.apiService.deleteAuthSource(this.selectedServer).subscribe(
            (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Server '${this.selectedServer?.name}' deleted successfully.`,
              });
              this.showSideBar = false;
              this.fetchLDAPServers();
            },
            (error) => {
              console.error('Error deleting server:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to delete server '${this.selectedServer?.name}'.`,
              });
            }
          );
        }
      }

  }

  addServer() {
    console.log(this.selectedServer);
    this.selectedServer = {
      id: -1,
      name: '',
      server_type: 'ldap',
      description: '',
      ssl: false,
      bind_user_dn: '',
      bind_password: '',
      host: '',
      port: 389,
    };
    this.showSideBar = true;
  }

  updateServerAvailability() {
    this.availableServers = [];
    for (let server of this.servers) {
      this.apiService.testAuthSource(undefined, true, server.id).subscribe(
        (response) => {
          console.log(response);
          if (response.code == 0) {
            this.availableServers.push(server.id);
          }
        },
        (error) => {
          console.error('Error checking server availablitiy:', error);
        }
      );
    }
  }
}