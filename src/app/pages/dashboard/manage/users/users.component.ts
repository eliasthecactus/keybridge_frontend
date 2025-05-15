import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { User } from '../../../../interfaces/user';
import { ApiService } from '../../../../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  imports: [TableModule, ToastModule, ButtonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [ApiService, MessageService],
})
export class UsersComponent {

    users: User[] = [];
    loadingUsers: boolean = false;
    selectedUser: User | undefined = undefined;
  
    constructor(private apiService: ApiService) {}
  
  
    refreshUsers() {
      console.log('Refreshing users');
    }

}
