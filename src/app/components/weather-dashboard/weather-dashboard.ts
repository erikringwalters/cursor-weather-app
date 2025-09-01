import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { WeatherService } from '../../services/weather';
import { WeatherData } from '../../models/weather';
import { SearchBarComponent } from '../search-bar/search-bar';
import { WeatherCardComponent } from '../weather-card/weather-card';

@Component({
  selector: 'app-weather-dashboard',
  templateUrl: './weather-dashboard.html',
  styleUrls: ['./weather-dashboard.scss'],
  standalone: true,
  imports: [CommonModule, SearchBarComponent, WeatherCardComponent]
})
export class WeatherDashboardComponent implements OnInit, OnDestroy {
  currentWeather: WeatherData | null = null;
  recentSearches: string[] = [];
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    // Subscribe to weather updates
    this.weatherService.currentWeather$
      .pipe(takeUntil(this.destroy$))
      .subscribe(weather => {
        this.currentWeather = weather;
        this.isLoading = false;
        this.error = null;
      });

    // Subscribe to recent searches
    this.weatherService.recentSearches$
      .pipe(takeUntil(this.destroy$))
      .subscribe(searches => {
        this.recentSearches = searches;
      });

    // Load initial mock data
    this.loadInitialData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLocationSelected(location: string) {
    this.searchWeather(location);
  }

  onRecentSearchClick(location: string) {
    this.searchWeather(location);
  }

  private searchWeather(location: string) {
    this.isLoading = true;
    this.error = null;

    this.weatherService.getCurrentWeather(location).subscribe({
      next: (weather) => {
        this.weatherService.setCurrentWeather(weather);
      },
      error: (error) => {
        console.error('Error fetching weather:', error);
        this.error = 'Unable to fetch weather data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private loadInitialData() {
    // Load initial mock data for development
    const mockWeather = this.weatherService.getMockWeatherData('New York');
    this.weatherService.setCurrentWeather(mockWeather);
  }

  clearError() {
    this.error = null;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getCurrentDate(): Date {
    return new Date();
  }
}
