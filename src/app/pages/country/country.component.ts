import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { LineChartData } from 'src/app/core/models/LineChartData';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { Participation } from 'src/app/core/models/Participation';
import { Router } from '@angular/router';
@Component({
  selector: 'app-country',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    AsyncPipe,
    NgxChartsModule,
  ],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})

export class CountryComponent implements OnInit, OnDestroy {
  country$!: Observable<Olympic>;
  numberOfMedals!: number;
  numberOfAthletes!: number;
  // ngx-charts config
  chartData: LineChartData[] = [];
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Année';
  yAxisLabel: string = 'Médailles';
  timeline: boolean = true;
  autoscale: boolean = true;
  yScaleMin: number = 0;
  yScaleMax: number = 500;
  animations: boolean = false;
  private countrySubscription!: Subscription;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCountry();
    this.countrySubscription = this.country$.subscribe({
      next: (country: Olympic) => {
        if (!country) {
          // Redirect to 'not-found' if the country is not found
          this.router.navigate(['/not-found']);
        } else {
          // Update chart data with the found country
          this.chartData = this.getChartData(country);
        }
      },
      error: (err) => {
        console.error('Error fetching country:', err);
        // Redirect to 'not-found' in case of any error
        this.router.navigate(['/not-found']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.countrySubscription && !this.countrySubscription.closed) {
      this.countrySubscription.unsubscribe();
    }
  }

  getTotalMedals(country: Olympic): number {
    return country.participations?.reduce((sum, p) => sum + p.medalsCount, 0) || 0;
  }

  getTotalAthletes(country: Olympic): number {
    return country.participations?.reduce((sum, p) => sum + p.athleteCount, 0) || 0;
  }

  getChartData(country: Olympic): LineChartData[] {
    const series = country.participations.map((participation: Participation): PieChartData => ({
      name: participation.year.toString(),
      value: participation.medalsCount,
      extra: { city: participation.city }
    }));

    const minValue = Math.min(...series.map(s => s.value));
    const maxValue = Math.max(...series.map(s => s.value));

    this.yScaleMin = Math.max(0, minValue * 0.6);
    this.yScaleMax = maxValue + 2;

    return [{
      name: country.country,
      series
    }]
  }

  formatYAxis(value: number): string {
    return Math.floor(value).toString();
  }

  private getCountry() {
    const countryId = this.route.snapshot.params['id'];
    this.country$ = this.olympicService.getCountryById(countryId);
  }
}
