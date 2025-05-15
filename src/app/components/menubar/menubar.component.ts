import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { UtilsService } from '../../services/utils.service';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-menubar',
  imports: [
    MenubarModule,
    CommonModule,
    BadgeModule,
  ],
  templateUrl: './menubar.component.html',
  styleUrl: './menubar.component.css',
  providers: [UtilsService],
})
export class MenubarComponent {
  items: MenuItem[] | undefined;

  constructor(private router: Router, private utilsService: UtilsService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/admin/dashboard',
        badge: '0',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Manage',
        icon: 'pi pi-sliders-h',
        items: [
          {
            label: 'Applications',
            icon: 'pi pi-stop',
            routerLink: '/admin/dashboard/manage/applications',
          },
          {
            label: 'Authentication',
            icon: 'pi pi-shield',
            routerLink: '/admin/dashboard/manage/authentication',
          },
          // {
          //   label: 'Clients',
          //   icon: 'pi pi-desktop',
          //   routerLink: '/admin/dashboard/manage/clients',
          // },
          // {
          //   label: 'Users',
          //   icon: 'pi pi-user',
          //   routerLink: '/admin/dashboard/manage/users',
          // },
        ],
      },
      {
        label: 'Logs',
        icon: 'pi pi-list-check',
        routerLink: '/admin/dashboard/logs',
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: '/admin/dashboard/settings',
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.utilsService.logout();
          this.router.navigate(['/admin/auth']);
        },
      },
    ];
  }
}
