import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RentalService {
  private apiUrl = 'http://0.0.0.0:8000';  // Assuming this is your FastAPI backend URL

  constructor(private http: HttpClient) {}

  getRentals(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }
}