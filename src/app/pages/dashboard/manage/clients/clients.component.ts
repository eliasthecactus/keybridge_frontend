import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Client } from '../../../../interfaces/client';
import { ApiService } from '../../../../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-clients',
  imports: [ToastModule, ButtonModule, TableModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  providers: [ApiService, MessageService],
})
export class ClientsComponent {

  clients: Client[] = [];
  loadingClients: boolean = false;
  selectedClient: Client | undefined = undefined;

  constructor(private apiService: ApiService) {}


  refreshClients() {
    console.log('Refreshing clients');
  }

}
