import { Component, inject, TemplateRef } from '@angular/core';
import { APIService } from '../services/api.service';
import { WeatherWidgetComponent } from './weather-widget/weather-widget.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    WeatherWidgetComponent, 
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {ngSkipHydration: 'true'},
})
export class HeaderComponent {
  private modalService = inject(NgbModal);
  isSexton = this.apiService.isSexton();

  constructor(private apiService: APIService, private router: Router) {}

  //Open info popup view
	open(content: TemplateRef<any>) {
		this.modalService.open(content, { backdrop: 'static', 
                                      animation: true, 
                                      centered: true }).result.then();
	}

  // Log out the sexton and reload the page
  logout(): void {
    this.apiService.logout(); // Call logout method from APIService
    window.location.reload();
  }
}
