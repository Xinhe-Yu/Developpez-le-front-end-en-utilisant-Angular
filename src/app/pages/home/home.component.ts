import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
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

export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[] | null>;
  svgIconPath: string = 'src/assets/mock/icons/medal-solid.svg';
  // ngx-charts config
  chartData$!: Observable<PieChartData[]>;
  gradient: boolean = false;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  maxLabelLength: number = 20;
  trimLabels: boolean = false;
  disable: boolean = false;

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.chartData$ = this.olympics$.pipe(
      map((olympics: Olympic[] | null) => this.transformData(olympics))
    );
  };

  onSelect(event: any): void {
    const countryId = event.extra.id;
    this.router.navigate(['/countries', countryId])
  }

  private transformData(olympics: Olympic[] | null): PieChartData[] {
    if (!olympics) return [];
    return olympics.map(olympic => ({
      name: olympic.country,
      value: olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0),
      extra: { id: olympic.id }
    }));
  }
}
