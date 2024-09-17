import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }
// export class HomeComponent implements OnInit {
//   public olympics$: Observable<any> = of(null);

//   constructor(private olympicService: OlympicService) { }

//   ngOnInit(): void {
//     this.olympics$ = this.olympicService.getOlympics();
//   }
// }
