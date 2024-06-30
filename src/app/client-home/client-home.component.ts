import { Component } from '@angular/core';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-client-home',
  standalone: true,
  imports: [ClientHeaderComponent, RouterOutlet, SearchBarComponent],
  templateUrl: './client-home.component.html',
  styleUrl: './client-home.component.css'
})
export class ClientHomeComponent {
  adminDetails = {
    email: "[adminEmail]",
    role: "admin",
    password: "[adminPassword]"
  };

  getFormattedAdminDetails(): string {
    return JSON.stringify(this.adminDetails).replace(/\"/g, "");
  }
}
