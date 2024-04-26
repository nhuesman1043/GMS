import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private apiService: APIService) {}

  logout(): void {
    this.apiService.logout(); // Call logout method from APIService
    // Optionally perform additional logout-related tasks (e.g., redirect)
  }
}
