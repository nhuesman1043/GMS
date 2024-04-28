import { Component, inject, TemplateRef } from '@angular/core';
import { APIService } from '../services/api.service';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [WeatherWidgetComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {ngSkipHydration: 'true'},
})
export class HeaderComponent {
  private modalService = inject(NgbModal);
  constructor(private apiService: APIService) {}

  //Open info popup view
	open(content: TemplateRef<any>) {
		this.modalService.open(content, { backdrop: 'static', 
                                      animation: true, 
                                      centered: true }).result.then();
	}
  logout(): void {
    this.apiService.logout(); // Call logout method from APIService
    // Optionally perform additional logout-related tasks (e.g., redirect)
  }
}
