import { Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Property } from './app/models/property.interface';
import { PropertyService } from './app/services/property.service';
import { importProvidersFrom } from '@angular/core';
import { SearchComponent } from './app/components/search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SearchComponent],
  templateUrl: './app.component.html'
})
export class App implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  searchAddress: string = '';
  filters = {
    beds: '',
    baths: '',
    parking: ''
  };

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe(
      (data) => {
        this.properties = data;
        this.applyFilters();
      },
      (error) => {
        console.error('Error loading properties:', error);
      }
    );
  }

  onSearchChange() {
    if (this.searchAddress.trim()) {
      this.propertyService.searchByAddress(this.searchAddress).subscribe(
        (data) => {
          this.properties = data;
          this.applyFilters();
        },
        (error) => {
          console.error('Error searching properties:', error);
        }
      );
    } else {
      this.loadProperties();
    }
  }

  applyFilters() {
    let filtered = [...this.properties];

    if (this.filters.beds) {
      const beds = Number(this.filters.beds);
      if (!isNaN(beds)) {
        filtered = filtered.filter(p => Number(p.beds) === beds);
      }
    }

    if (this.filters.baths) {
      const baths = Number(this.filters.baths);
      if (!isNaN(baths)) {
        filtered = filtered.filter(p => Number(p.baths) === baths);
      }
    }

    if (this.filters.parking) {
      const parking = Number(this.filters.parking);
      if (!isNaN(parking)) {
        filtered = filtered.filter(p => Number(p.parking) === parking);
      }
    }

    this.filteredProperties = filtered;
  }

  onSearchResults(results: Property[]) {
    this.properties = results;
    this.applyFilters();
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));