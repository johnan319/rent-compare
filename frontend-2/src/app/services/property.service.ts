import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Property } from '../models/property.interface';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://0.0.0.0:8000';

  constructor(private http: HttpClient) {}

  getProperties(): Observable<Property[]> {
    // This can be removed if you don't need a default listing
    return this.http.get<Property[]>(`${this.apiUrl}/listings/default`)
      .pipe(
        catchError(error => {
          console.error('Error fetching properties:', error);
          throw error;
        })
      );
  }

  searchByAddress(address: string): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/listings/${encodeURIComponent(address)}`)
      .pipe(
        catchError(error => {
          console.error('Error searching properties:', error);
          throw error;
        })
      );
  }
}