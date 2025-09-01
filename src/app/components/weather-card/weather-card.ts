import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherData } from '../../models/weather';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.html',
  styleUrls: ['./weather-card.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class WeatherCardComponent implements OnInit {
  @Input() weatherData: WeatherData | null = null;
  @Input() showDetails = false;
  
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';
  currentTime: string = '';

  ngOnInit() {
    this.updateCurrentTime();
    setInterval(() => this.updateCurrentTime(), 1000);
  }

  toggleTemperatureUnit() {
    this.toggleShowDetails();
    this.temperatureUnit = this.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius';
  }

  toggleShowDetails() {
    this.showDetails = !this.showDetails;
  }

  getTemperature(): number {
    if (!this.weatherData) return 0;
    return this.temperatureUnit === 'celsius' 
      ? this.weatherData.current.temp_c 
      : this.weatherData.current.temp_f;
  }

  getFeelsLike(): number {
    if (!this.weatherData) return 0;
    return this.temperatureUnit === 'celsius' 
      ? this.weatherData.current.feelslike_c 
      : this.weatherData.current.feelslike_f;
  }

  getTemperatureUnit(): string {
    return this.temperatureUnit === 'celsius' ? '°C' : '°F';
  }

  getWindSpeed(): number {
    if (!this.weatherData) return 0;
    return this.temperatureUnit === 'celsius' 
      ? this.weatherData.current.wind_kph 
      : this.weatherData.current.wind_mph;
  }

  getWindUnit(): string {
    return this.temperatureUnit === 'celsius' ? 'km/h' : 'mph';
  }

  getPressure(): number {
    if (this.temperatureUnit === 'celsius') {
      return this.weatherData?.current.pressure_mb || 0;
    } else {
      return this.weatherData?.current.pressure_in || 0;
    }
  }

  getPressureUnit(): string {
    return this.temperatureUnit === 'celsius' ? 'mb' : 'in';
  }

  getVisibility(): number {
    if (!this.weatherData) return 0;
    return this.temperatureUnit === 'celsius' 
      ? this.weatherData.current.visibility_km 
      : this.weatherData.current.visibility_miles;
  }

  getVisibilityUnit(): string {
    return this.temperatureUnit === 'celsius' ? 'km' : 'miles';
  }

  private updateCurrentTime() {
    if (this.weatherData?.location.localtime) {
      const date = new Date(this.weatherData.location.localtime);
      this.currentTime = date.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    }
  }

  getWeatherIconUrl(icon: string): string {
    // Handle different icon URL formats from WeatherAPI
    if (!icon) return '';
    
    // If it's already a full URL, return as is
    if (icon.startsWith('http://') || icon.startsWith('https://')) {
      return icon;
    }
    
    // If it starts with //, add https:
    if (icon.startsWith('//')) {
      return 'https:' + icon;
    }
    
    // If it starts with /, it's a relative path from weatherapi.com
    if (icon.startsWith('/')) {
      return 'https://weatherapi.com' + icon;
    }
    
    // If it's just a filename, construct the full URL
    // WeatherAPI.com icons are typically at: https://weatherapi.com/static/weather/64x64/day/113.png
    if (icon.includes('.')) {
      // Extract day/night and icon number from the path
      const parts = icon.split('/');
      if (parts.length >= 3) {
        const timeOfDay = parts[parts.length - 2]; // 'day' or 'night'
        const iconFile = parts[parts.length - 1]; // '113.png'
        return `https://weatherapi.com/static/weather/64x64/${timeOfDay}/${iconFile}`;
      }
    }
    
    // Fallback: return the original icon
    return icon;
  }

  getWeatherBackgroundClass(): string {
    if (!this.weatherData) return 'default-bg';
    
    const condition = this.weatherData.current.condition.text.toLowerCase();
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour <= 18;
    
    if (condition.includes('sunny') || condition.includes('clear')) {
      return isDay ? 'sunny-day' : 'clear-night';
    } else if (condition.includes('cloudy') || condition.includes('overcast')) {
      return 'cloudy';
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'rainy';
    } else if (condition.includes('snow')) {
      return 'snowy';
    } else if (condition.includes('storm') || condition.includes('thunder')) {
      return 'stormy';
    } else if (condition.includes('fog') || condition.includes('mist')) {
      return 'foggy';
    }
    
    return isDay ? 'default-day' : 'default-night';
  }
}
