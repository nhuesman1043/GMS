import { Component, inject, TemplateRef } from '@angular/core';
import { APIService } from '../services/api.service';
import { WeatherWidgetComponent } from './weather-widget/weather-widget.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [WeatherWidgetComponent, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {ngSkipHydration: 'true'},
})
export class HeaderComponent {
  private modalService = inject(NgbModal);
  constructor(private apiService: APIService, private router: Router) {}

  //Open info popup view
	open(content: TemplateRef<any>) {
		this.modalService.open(content, { backdrop: 'static', 
                                      animation: true, 
                                      centered: true }).result.then();
	}

  isSexton = this.apiService.isSexton();

  reloadPage(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl(currentUrl);
    });
  }

  logout(): void {
    this.apiService.logout(); // Call logout method from APIService
    //this.router.navigate(['/home']);
    window.location.reload();
  }
}
