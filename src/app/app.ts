import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherDashboardComponent } from './components/weather-dashboard/weather-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, WeatherDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'weather-app';
}
