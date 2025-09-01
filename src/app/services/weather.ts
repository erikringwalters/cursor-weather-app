import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { WeatherData } from '../models/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '33ee0b6d89514f68b99234500253108'; // Real API key from WeatherAPI.com
  private baseUrl = 'http://api.weatherapi.com/v1';
  private useMockData = false; // Now using real API
  
  private currentWeatherSubject = new BehaviorSubject<WeatherData | null>(null);
  public currentWeather$ = this.currentWeatherSubject.asObservable();

  private recentSearchesSubject = new BehaviorSubject<string[]>([]);
  public recentSearches$ = this.recentSearchesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadRecentSearches();
  }

  getCurrentWeather(location: string): Observable<WeatherData> {
    // If using mock data or no API key, return mock data
    if (this.useMockData || this.apiKey === 'YOUR_API_KEY') {
      const mockData = this.getMockWeatherData(location);
      return of(mockData);
    }

    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('q', location)
      .set('aqi', 'no');

    return this.http.get<WeatherData>(`${this.baseUrl}/current.json`, { params });
  }

  getForecast(location: string, days: number = 7): Observable<WeatherData> {
    // If using mock data or no API key, return mock data
    if (this.useMockData || this.apiKey === 'YOUR_API_KEY') {
      const mockData = this.getMockWeatherData(location);
      return of(mockData);
    }

    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('q', location)
      .set('days', days.toString())
      .set('aqi', 'no')
      .set('alerts', 'no');

    return this.http.get<WeatherData>(`${this.baseUrl}/forecast.json`, { params });
  }

  searchLocation(query: string): Observable<any> {
    // If using mock data or no API key, return mock search results
    if (this.useMockData || this.apiKey === 'YOUR_API_KEY') {
      const mockResults = this.getMockSearchResults(query);
      return of(mockResults);
    }

    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('q', query);

    return this.http.get(`${this.baseUrl}/search.json`, { params });
  }

  setCurrentWeather(weather: WeatherData) {
    this.currentWeatherSubject.next(weather);
    this.addToRecentSearches(weather.location.name);
  }

  private addToRecentSearches(location: string) {
    const current = this.recentSearchesSubject.value;
    const filtered = current.filter(item => item !== location);
    const updated = [location, ...filtered].slice(0, 5); // Keep only last 5 searches
    this.recentSearchesSubject.next(updated);
    this.saveRecentSearches(updated);
  }

  private saveRecentSearches(searches: string[]) {
    localStorage.setItem('recentSearches', JSON.stringify(searches));
  }

  private loadRecentSearches() {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        const searches = JSON.parse(saved);
        this.recentSearchesSubject.next(searches);
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }

  // Mock data for development (remove when using real API)
  getMockWeatherData(location: string = 'New York'): WeatherData {
    return {
      location: {
        name: location,
        country: 'United States of America',
        region: 'New York',
        lat: 40.7128,
        lon: -74.0060,
        localtime: new Date().toISOString()
      },
      current: {
        temp_c: 22,
        temp_f: 72,
        condition: {
          text: 'Partly cloudy',
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
          code: 1003
        },
        humidity: 65,
        wind_kph: 15,
        wind_mph: 9,
        wind_dir: 'NW',
        pressure_mb: 1013,
        pressure_in: 29.91,
        feelslike_c: 24,
        feelslike_f: 75,
        uv: 5,
        visibility_km: 10,
        visibility_miles: 6
      },
      forecast: {
        forecastday: [
          {
            date: new Date().toISOString().split('T')[0],
            day: {
              maxtemp_c: 25,
              maxtemp_f: 77,
              mintemp_c: 18,
              mintemp_f: 64,
              avgtemp_c: 22,
              avgtemp_f: 71,
              maxwind_kph: 20,
              maxwind_mph: 12,
              totalprecip_mm: 0,
              totalprecip_in: 0,
              avghumidity: 60,
              condition: {
                text: 'Partly cloudy',
                icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
                code: 1003
              }
            },
            hour: []
          }
        ]
      }
    };
  }

  // Mock search results for development
  getMockSearchResults(query: string): any[] {
    const mockCities = [
      { name: 'New York', country: 'United States of America' },
      { name: 'London', country: 'United Kingdom' },
      { name: 'Tokyo', country: 'Japan' },
      { name: 'Paris', country: 'France' },
      { name: 'Sydney', country: 'Australia' },
      { name: 'Berlin', country: 'Germany' },
      { name: 'Moscow', country: 'Russia' },
      { name: 'Beijing', country: 'China' }
    ];

    return mockCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      city.country.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Method to enable real API when you have a key
  enableRealAPI(apiKey: string) {
    this.apiKey = apiKey;
    this.useMockData = false;
  }
}
