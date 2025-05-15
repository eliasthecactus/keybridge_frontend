import { Component } from '@angular/core';
import { MenubarComponent } from '../../components/menubar/menubar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-dashboard-page',
    imports: [MenubarComponent, RouterOutlet],
    templateUrl: './dashboard-page.component.html',
    styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {



}
