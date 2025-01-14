import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from '../services/property.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="onSubmit()" class="search-form">
      <div class="form-row">
        <div class="form-group">
          <label for="streetNumber">Street Number</label>
          <input 
            id="streetNumber"
            type="text" 
            formControlName="streetNumber"
            placeholder="e.g., 111"
          >
          <div class="error-message" *ngIf="searchForm.get('streetNumber')?.invalid && searchForm.get('streetNumber')?.touched">
            Please enter a valid street number
          </div>
        </div>

        <div class="form-group">
          <label for="streetName">Street Name</label>
          <input 
            id="streetName"
            type="text" 
            formControlName="streetName"
            placeholder="e.g., anderston street"
          >
          <div class="error-message" *ngIf="searchForm.get('streetName')?.invalid && searchForm.get('streetName')?.touched">
            Please enter a street name
          </div>
        </div>

        <div class="form-group">
          <label for="suburb">Suburb</label>
          <input 
            id="suburb"
            type="text" 
            formControlName="suburb"
            placeholder="e.g., melbourne"
          >
          <div class="error-message" *ngIf="searchForm.get('suburb')?.invalid && searchForm.get('suburb')?.touched">
            Please enter a suburb
          </div>
        </div>

        <div class="form-group">
          <label for="state">State</label>
          <select id="state" formControlName="state">
            <option value="">Select State</option>
            <option value="vic">VIC</option>
            <option value="nsw">NSW</option>
            <option value="qld">QLD</option>
            <option value="wa">WA</option>
            <option value="sa">SA</option>
            <option value="tas">TAS</option>
            <option value="act">ACT</option>
            <option value="nt">NT</option>
          </select>
          <div class="error-message" *ngIf="searchForm.get('state')?.invalid && searchForm.get('state')?.touched">
            Please select a state
          </div>
        </div>

        <div class="form-group">
          <label for="postcode">Postcode</label>
          <input 
            id="postcode"
            type="text" 
            formControlName="postcode"
            placeholder="e.g., 8000"
            maxlength="4"
          >
          <div class="error-message" *ngIf="searchForm.get('postcode')?.invalid && searchForm.get('postcode')?.touched">
            Please enter a valid 4-digit postcode
          </div>
        </div>
      </div>

      <button type="submit" [disabled]="searchForm.invalid">Search</button>
    </form>
  `,
  styles: [`
    .search-form {
      padding: 20px;
    }
    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 15px;
    }
    .form-group {
      flex: 1;
      min-width: 200px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    input.ng-invalid.ng-touched, select.ng-invalid.ng-touched {
      border-color: red;
    }
    .error-message {
      color: red;
      font-size: 0.8em;
      margin-top: 5px;
    }
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background-color: #cccccc;
    }
  `]
})
export class SearchComponent {
  @Output() searchResults = new EventEmitter<any[]>();
  
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService
  ) {
    this.searchForm = this.fb.group({
      streetNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      streetName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      suburb: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      state: ['', Validators.required],
      postcode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]]
    });
  }

  onSubmit() {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;
      const formattedAddress = this.formatAddress(formValue);
      this.propertyService.searchByAddress(formattedAddress).subscribe(
        (response) => {
          this.searchResults.emit(response);
        },
        (error) => {
          console.error('Search error:', error);
        }
      );
    }
  }

  private formatAddress(formValue: any): string {
    const { streetNumber, streetName, suburb, state, postcode } = formValue;
    return `${streetNumber}-${streetName.replace(/\s+/g, '-')}-${suburb}-${state}-${postcode}`.toLowerCase();
  }
} 