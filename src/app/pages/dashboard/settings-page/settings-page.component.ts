import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { MessageService } from 'primeng/api';
import { SyslogServer } from '../../../interfaces/syslog-server';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { SmtpServer } from '../../../interfaces/smtp-server';
import { cloneDeep, isEqual } from 'lodash';
import { PasswordModule } from 'primeng/password';
import { TagModule } from 'primeng/tag';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DialogModule } from 'primeng/dialog';
import { UtilsService } from '../../../services/utils.service';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TwoFaSource } from '../../../interfaces/two-fa-source';
import { CheckboxModule } from 'primeng/checkbox';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-settings-page',
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    SelectModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    TagModule,
    InputGroupModule,
    InputGroupAddonModule,
    DialogModule,
    DividerModule,
    FloatLabelModule,
    CheckboxModule,
    BlockUIModule,
    PanelModule,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
  providers: [MessageService, ApiService, UtilsService],
})
export class SettingsPageComponent {
  syslogServer: SyslogServer | null = null;
  originalSyslogServer: SyslogServer | null = null;
  loadingSyslogServers: boolean = false;

  smtpServer: SmtpServer | null = null;
  originalSmtpServer: SmtpServer | null = null;
  loadingSmtpServers: boolean = false;

  licenseKey: string = '';

  showEmailSendToTestDialog: boolean = false;
  sendToEmail: string = '';

  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  syslogProtocols = [
    { name: 'TCP', value: 'tcp' },
    { name: 'UDP', value: 'udp' },
  ];
  smtpSecurity = [
    { name: 'STARTTLS', value: 'STARTTLS' },
    { name: 'SSL', value: 'SSL' },
    { name: 'None', value: 'NONE' },
  ];

  twoFaSource: TwoFaSource | null = null;
  twoFaSourceOriginal: TwoFaSource | null = null;
  twoFaTypes = [{ name: 'LinOTP', value: 'linotp' }];

  showTwoFaTestDialog: boolean = false;
  twoFaTestUsername: string = '';
  twoFaTestCode: string = '';
  twoFaTestLoading: boolean = false;
  twoFaEnabled: boolean = true;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private utilsService: UtilsService
  ) {
    this.fetchServers();
    this.loadTwoFaSource();
  }

  ngOnInit() {
    // this.syslogServer = this.fetchLDAPServers();
  }

  fetchServers(): void {
    this.getSyslogServer();
    this.getSmtpServer();
  }

  // editServer(server: SyslogServer): void {
  //   this.syslogServer = { ...server };
  // }

  getSyslogServer(): void {
    this.apiService.getSyslogServer().subscribe(
      (response) => {
        console.log(response);
        if (response.data && response.data.length > 0) {
          this.syslogServer = response.data[0];
          // this.originalSyslogServer = { ...response.data[0] }; // Ensure you keep an unmodified copy
          this.originalSyslogServer = cloneDeep(this.syslogServer);
        } else {
          this.addSyslogServer(); // Add a new server if no data is returned
        }
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching auth servers',
        });
        this.syslogServer = null;
      }
    );
  }

  saveSyslogServer(): void {
    if (this.syslogServer) {
      if (this.syslogServer.id == -1) {
        // console.log("new server selected");
        this.apiService.addSyslogServer(this.syslogServer).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Server '${this.syslogServer?.host}' added successfully.`,
            });
            this.getSyslogServer();
          },
          (error) => {
            console.error('Error adding server:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to add server '${this.syslogServer?.host}'.`,
            });
          }
        );
      } else {
        this.apiService.updateSyslogServer(this.syslogServer).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Server '${this.syslogServer?.host}' updated successfully.`,
            });
            this.getSyslogServer(); // Refresh the list
          },
          (error) => {
            console.error('Error updating server:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to update server '${this.syslogServer?.host}'.`,
            });
          }
        );
      }
    }
  }

  deleteSyslogServer() {
    if (this.syslogServer) {
      this.apiService.deleteSyslogServer(this.syslogServer).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Server '${this.syslogServer?.host}' deleted successfully.`,
          });
          this.getSyslogServer();
        },
        (error) => {
          console.error('Error deleting server:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete server '${this.syslogServer?.host}'.`,
          });
        }
      );
    }
  }

  addSyslogServer() {
    // console.log(this.syslogServer);
    this.syslogServer = {
      id: -1,
      host: '',
      port: 514,
      protocol: 'udp',
      disabled: false,
      name: "default"
    };
  }

  testSyslogServer() {
    this.messageService.add({
      severity: 'info',
      summary: 'Comming soon',
      detail: `Feature not implemented yet`,
    });
  }

  syslogServerEdited(): boolean {
    return (
      JSON.stringify(this.syslogServer) !==
      JSON.stringify(this.originalSyslogServer)
    );
  }

  getSmtpServer(): void {
    this.apiService.getSmtpServer().subscribe(
      (response) => {
        console.log(response);
        if (response.data && response.data.length > 0) {
          this.smtpServer = response.data[0];
          // this.originalSmtpServer = { ...response.data[0] }; // Ensure you keep an unmodified copy
          this.originalSmtpServer = cloneDeep(this.smtpServer);
        } else {
          this.addSmtpServer(); // Add a new server if no data is returned
        }
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching auth servers',
        });
        this.smtpServer = null;
      }
    );
  }

  saveSmtpServer(): void {
    if (this.smtpServer) {
      if (this.smtpServer.id == -1) {
        // console.log("new server selected");
        this.apiService.addSmtpServer(this.smtpServer).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Server '${this.smtpServer?.host}' added successfully.`,
            });
            this.getSmtpServer();
          },
          (error) => {
            console.error('Error adding server:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to add server '${this.smtpServer?.host}'.`,
            });
          }
        );
      } else {
        this.apiService.updateSmtpServer(this.smtpServer).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Server '${this.smtpServer?.host}' updated successfully.`,
            });
            this.getSmtpServer(); // Refresh the list
          },
          (error) => {
            console.error('Error updating server:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to update server '${this.smtpServer?.host}'.`,
            });
          }
        );
      }
    }
  }

  deleteSmtpServer() {
    if (this.smtpServer) {
      this.apiService.deleteSmtpServer(this.smtpServer).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Server '${this.smtpServer?.host}' deleted successfully.`,
          });
          this.getSmtpServer();
        },
        (error) => {
          console.error('Error deleting server:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete server '${this.smtpServer?.host}'.`,
          });
        }
      );
    }
  }

  addSmtpServer() {
    // console.log(this.syslogServer);
    this.smtpServer = {
      id: -1,
      host: '',
      port: 587,
      username: '',
      password: '',
      security: 'STARTTLS',
      from_email: '',
    };
  }

  testSmtpServer() {
    if (this.utilsService.isValidEmail(this.sendToEmail)) {
      this.apiService
        .sendMail(
          'This is a test nessage to check the SMTP configuration of KeyBridge',
          'swiss.elk@hotmail.com',
          'KeyBridge Test'
        )
        .subscribe(
          (response) => {
            console.log(response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully sent test mail'!,
            });
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message.toString(),
            });
          }
        );

      this.showEmailSendToTestDialog = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in an email address',
      });
    }
  }

  smtpServerEdited(): boolean {
    return !isEqual(this.smtpServer, this.originalSmtpServer);
  }

  addLicenseKey(key: string): void {
    console.log(key);
  }

  changePassword(): void {
    console.log('change password');
    if (
      this.newPassword == this.confirmNewPassword &&
      this.newPassword.length > 7 &&
      this.newPassword != this.oldPassword
    ) {
      this.apiService
        .changePassword(this.oldPassword, this.newPassword)
        .subscribe(
          (response) => {
            console.log(response);
            this.oldPassword = '';
            this.newPassword = '';
            this.confirmNewPassword = '';
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Successfully changed the passwords'!,
            });
          },
          (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message.toString(),
            });
          }
        );

      this.showEmailSendToTestDialog = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please choose a new password (8+ Char, not the old pw)',
      });
    }
  }

  loadTwoFaSource() {
    this.apiService.getTwoFaSource().subscribe(
      (response) => {
        console.log(response);
        if (response.data.length > 0) {
        this.twoFaSource = response.data[0];
        console.log(this.twoFaSource);
        } else {
          this.twoFaSource = {
            id: -1,
            name: 'default',
            host: '',
            port: 443,
            ssl: false,
            disabled: true,
            type: 'linotp',
            realm: '',
          };
        }
        this.twoFaSourceOriginal = cloneDeep(this.twoFaSource);
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching two-factor authentication source',
        });
        this.twoFaSource = null;
      }
    );
  }

  saveTwoFaSource() {
    if (this.twoFaSource) {
      if (this.twoFaSource.id === -1) {
        // Add new 2FA source
        this.apiService.addTwoFaSource(this.twoFaSource).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `2FA Source '${this.twoFaSource?.name}' added successfully.`,
            });
            this.loadTwoFaSource();
          },
          (error) => {
            console.error('Error adding 2FA source:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to add 2FA Source '${this.twoFaSource?.name}'.`,
            });
          }
        );
      } else {
        // Update existing 2FA source
        this.apiService.updateTwoFaSource(this.twoFaSource).subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `2FA Source '${this.twoFaSource?.name}' updated successfully.`,
            });
            this.loadTwoFaSource();
          },
          (error) => {
            console.error('Error updating 2FA source:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to update 2FA Source '${this.twoFaSource?.name}'.`,
            });
          }
        );
      }
    }
  }
  deleteTwoFaSource() {
    if (this.twoFaSource) {
      this.apiService.deleteTwoFaSource(this.twoFaSource.id).subscribe(() => {
        this.twoFaSource = null;
      });
    }
  }

  twoFaSourceEdited(): boolean {
    return !isEqual(this.twoFaSource, this.twoFaSourceOriginal);
  }

  testTwoFa(): void {
    this.twoFaTestLoading = true;
    console.log('test two-factor authentication');
    this.apiService
     .testTwoFa(this.twoFaTestUsername, this.twoFaTestCode)
     .subscribe(
        (response) => {
          console.log(response);
          this.messageService.add({
            severity:'success',
            summary: 'Success',
            detail: 'Test result: Success!',
          });
          this.twoFaTestCode = '';
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message.toString(),
          });
        }
      );
      this.twoFaTestLoading = false;
  }
}
