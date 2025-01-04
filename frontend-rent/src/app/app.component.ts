import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PropertyComponent } from "./property/property.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PropertyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'frontend-rent';
}
