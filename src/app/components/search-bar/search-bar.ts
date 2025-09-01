import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { WeatherService } from '../../services/weather';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class SearchBarComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<string>();
  
  searchControl = new FormControl('');
  suggestions: any[] = [];
  showSuggestions = false;
  isLoading = false;
  private suggestionSelected = false;

  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((value): value is string => Boolean(value && value.length > 2))
    ).subscribe(query => {
      if (query && !this.suggestionSelected) {
        this.searchLocations(query);
      } else if (!query) {
        this.clearSuggestions();
      }
    });
  }

  searchLocations(query: string) {
    this.isLoading = true;
    this.weatherService.searchLocation(query).subscribe({
      next: (results) => {
        this.suggestions = results || [];
        this.showSuggestions = this.suggestions.length > 0;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error searching locations:', error);
        this.isLoading = false;
        this.clearSuggestions();
      }
    });
  }

  selectLocation(location: any) {
    const locationString = location.name + (location.country ? `, ${location.country}` : '');
    this.locationSelected.emit(locationString);
    this.searchControl.setValue(locationString);
    this.suggestionSelected = true;
    this.clearSuggestions();
  }

  onSearchSubmit() {
    const value = this.searchControl.value;
    if (value && value.trim()) {
      this.locationSelected.emit(value.trim());
      this.suggestionSelected = true;
      this.clearSuggestions();
    }
  }

  onFocus() {
    // Only show suggestions if we have them and haven't just selected one
    if (this.suggestions.length > 0 && !this.suggestionSelected) {
      this.showSuggestions = true;
      this.cdr.detectChanges();
    }
  }

  onBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.showSuggestions = false;
      this.cdr.detectChanges();
    }, 200);
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.suggestionSelected = false;
    this.clearSuggestions();
  }

  private clearSuggestions() {
    this.suggestions = [];
    this.showSuggestions = false;
    this.cdr.detectChanges();
  }

  // Reset suggestion state when user starts typing again
  onInput() {
    if (this.suggestionSelected) {
      this.suggestionSelected = false;
    }
  }
}
