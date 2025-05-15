import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Message } from '../../../interfaces/message';


@Component({
  selector: 'app-overview-page',
  imports: [CommonModule, ChartModule, TableModule, ButtonModule],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.css',
})
export class OverviewPageComponent {

  messages: Message[] = [];
  // data: any;

  // options: any;

  // platformId = inject(PLATFORM_ID);

  // constructor(private cd: ChangeDetectorRef) {}

  // ngOnInit() {
  //   this.initChart();
  // }

  // initChart() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const documentStyle = getComputedStyle(document.documentElement);
  //     const textColor = documentStyle.getPropertyValue('--p-text-color');
  //     const textColorSecondary = documentStyle.getPropertyValue(
  //       '--p-text-muted-color'
  //     );
  //     const surfaceBorder = documentStyle.getPropertyValue(
  //       '--p-content-border-color'
  //     );

  //     this.data = {
  //       labels: [
  //         'January',
  //         'February',
  //         'March',
  //         'April',
  //         'May',
  //         'June',
  //         'July',
  //       ],
  //       datasets: [
  //         {
  //           label: 'Opened applications',
  //           data: [65, 59, 80, 81, 56, 55, 40],
  //           fill: false,
  //           borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
  //           tension: 0.4,
  //         },
  //         {
  //           label: 'Second Dataset',
  //           data: [28, 48, 40, 19, 86, 27, 90],
  //           fill: false,
  //           borderColor: documentStyle.getPropertyValue('--p-gray-500'),
  //           tension: 0.4,
  //         },
  //       ],
  //     };

  //     this.options = {
  //       maintainAspectRatio: false,
  //       aspectRatio: 0.6,
  //       plugins: {
  //         legend: {
  //           labels: {
  //             color: textColor,
  //           },
  //         },
  //       },
  //       scales: {
  //         x: {
  //           ticks: {
  //             color: textColorSecondary,
  //           },
  //           grid: {
  //             color: surfaceBorder,
  //             drawBorder: false,
  //           },
  //         },
  //         y: {
  //           ticks: {
  //             color: textColorSecondary,
  //           },
  //           grid: {
  //             color: surfaceBorder,
  //             drawBorder: false,
  //           },
  //         },
  //       },
  //     };
  //     this.cd.markForCheck();
  //   }
  // }
}
