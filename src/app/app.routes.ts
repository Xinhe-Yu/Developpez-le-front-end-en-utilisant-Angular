import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CountryComponent } from './pages/country/country.component';

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: 'countries/:id', component: CountryComponent }
];
