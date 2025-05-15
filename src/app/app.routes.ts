import { Routes, RouterModule } from '@angular/router';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { SettingsPageComponent } from './pages/dashboard/settings-page/settings-page.component';
import { AuthGuard } from './guards/auth.guard';
import { OverviewPageComponent } from './pages/dashboard/overview-page/overview-page.component';
import { ApplicationsPageComponent } from './pages/dashboard/manage/applications-page/applications-page.component';
import { AuthenticationPageComponent } from './pages/dashboard/manage/authentication-page/authentication-page.component';
import { ApplicationPageComponent } from './pages/dashboard/manage/applications/application-page/application-page.component';
import { LogsComponent } from './pages/dashboard/logs/logs.component';
import { UsersComponent } from './pages/dashboard/manage/users/users.component';
import { ClientsComponent } from './pages/dashboard/manage/clients/clients.component';
import { SetupComponent } from './pages/setup/setup.component';

export const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full', // Redirect /admin to /admin/dashboard
      },
      {
        path: 'auth',
        component: AuthPageComponent, // Login page
      },
      {
        path: 'setup',
        component: SetupComponent, // Login page
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard], // Guard applies to dashboard and all its children
        component: DashboardPageComponent,
        children: [
          {
            path: '',
            component: OverviewPageComponent,
          },
          {
            path: 'settings',
            component: SettingsPageComponent,
          },
          {
            path: 'logs',
            component: LogsComponent,
          },
          {
            path: 'manage',
            children: [
              {
                path: 'applications',
                component: ApplicationsPageComponent,
              },
              {
                path: 'authentication',
                component: AuthenticationPageComponent,
              },
              {
                path: 'users',
                component: UsersComponent,
              },
              {
                path: 'clients',
                component: ClientsComponent,
              },
            ]
          },
          {
            path: 'manage/applications/application/:id',
            component: ApplicationPageComponent,
          }
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'admin', // Redirect unknown routes to /admin
  },

];