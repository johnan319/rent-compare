import { Component, Input } from '@angular/core';
import { Property } from '../models/property.model';

@Component({
  selector: 'app-property-card',
  standalone: true,
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.sass'
})
export class PropertyCardComponent {
  @Input() property!: Property;
}
