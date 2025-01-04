import { Component } from '@angular/core';
import { RentalService } from '../rental.service';
import { Property } from '../models/property.model';
import { CommonModule } from '@angular/common';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-property',
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './property.component.html',
  styleUrl: './property.component.sass'
})
export class PropertyComponent {
  constructor(private rentalService: RentalService) {}

  rentals: Property[] = [];

  ngOnInit() {
    this.getRentals();
  }

  getRentals() {
    this.rentalService.getRentals().subscribe(
      (data: any) => {
        this.rentals = data;
      },
      error => {
        console.error('Error fetching rentals:', error);
      }
    );
  }
}
