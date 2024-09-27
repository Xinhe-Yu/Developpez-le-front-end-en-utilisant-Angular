import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { AsyncPipe, NgIf } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgxChartsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit, OnDestroy {
  public olympics$!: Observable<Olympic[]>;
  svgIconPath: string = 'src/assets/mock/icons/medal-solid.svg';
  // ngx-charts config
  chartData: PieChartData[] = [];
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  maxLabelLength: number = 20;
  trimLabels: boolean = false;
  disable: boolean = false;
  private olympicsSubscription!: Subscription;

  constructor(
    private olympicService: OlympicService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympicsSubscription = this.olympics$.subscribe((olympics: Olympic[]) => {
      this.chartData = this.getChartData(olympics);
    })
  }

  ngOnDestroy(): void {
    if (this.olympicsSubscription && !this.olympicsSubscription.closed) {
      this.olympicsSubscription.unsubscribe();
    }
  }
  getChartData(olympics: Olympic[]): PieChartData[] {
    const chartData = olympics.map(olympic => {
      const totalMedals = olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0);

      return {
        name: olympic.country,
        value: totalMedals,
        extra: { id: olympic.id }
      };
    });
    return chartData;
  }

  onSelect(event: PieChartData): void {
    const countryId = event.extra?.id;
    this.router.navigate(['/countries', countryId])
  }
}
