import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Log } from '../../../interfaces/log';
import { ApiService } from '../../../services/api.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Tag, TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-logs',
  imports: [
    TableModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    TextareaModule,
    ButtonModule,
    TagModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css',
  providers: [MessageService],
})
export class LogsComponent {
  logs: {
    total: number;
    pages: number;
    current_page: number;
    logs: Log[];
  } | null = null;
  selectedLog: Log | null = null;

  tableLoading: boolean = false;
  tableSearchString: string = '';
  private searchSubject = new Subject<string>();

  showLogDataModal: boolean = false;

  levelFilter: string = '';
  currentPage: number = 1;
  rowsPerPage: number = 10;

  sortField: string = 'timestamp';
  sortOrder: number = -1;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Debounce search input to avoid frequent API calls
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchString) => {
      this.currentPage = 1;
      this.tableSearchString = searchString;
      this.fetchLogs(); // Fetch filtered logs
    });

    this.fetchLogs();
  }

  clearFilter(): void {
    this.levelFilter = '';
    this.tableSearchString = '';
    this.currentPage = 1;
    this.sortOrder = -1;
    this.sortField = 'timestamp';
    this.fetchLogs();
  }

  // tbd add filtering: https://primeng.org/table#filter

  fetchLogs(): void {
    if (this.tableLoading) {
      console.log('already fetching logs');
      return;
    }

    this.tableLoading = true;
    console.log('fetching logs');

    this.apiService
      .getLogs(
        this.levelFilter,
        this.currentPage,
        this.rowsPerPage,
        this.sortField,
        this.sortOrder === 1 ? 'asc' : 'desc',
        this.tableSearchString
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.logs = response.data;
          this.tableLoading = false;
          console.log('check response data');
        },
        (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error while fetching logs',
          });
          this.tableLoading = false;
          this.logs = null;
        }
      );
    console.log('end fetch logs');
  }


  onFilterChange(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
    console.log(event);
  }

  getSeverity(
    level: string
  ):
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    switch (level.toLowerCase()) {
      case 'info':
        return 'info';
      case 'warning': // Update this case to map to 'warn'
        return 'warn';
      case 'error':
        return 'danger';
      case 'critical':
        return 'danger';
      case 'success':
        return 'success';
      default:
        return 'secondary';
    }
  }

  onLazyLoad(event: any): void {
    console.log("checker1")
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.rowsPerPage = event.rows;
    this.sortField = event.sortField || this.sortField;
    this.sortOrder = event.sortOrder || this.sortOrder;
    this.fetchLogs();
    console.log(this.sortOrder);
  }

  
  showLogData(id: string) {
    console.log('show log data, id: ' + id);
    if (this.logs) {
      for (let i = 0; i < this.logs?.logs.length; i++) {
        if (this.logs.logs[i].id === parseInt(id)) {
          this.selectedLog = { ...this.logs.logs[i] };
          break;
        }
      }
      this.showLogDataModal = true;
    }
  }
}
