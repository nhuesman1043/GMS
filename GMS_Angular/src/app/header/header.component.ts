import { Component, inject, TemplateRef,  EventEmitter, HostListener, Output, Input, SimpleChanges, SimpleChange, OnChanges, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { NgbModal, ModalDismissReasons, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [WeatherWidgetComponent,
    MatDialogModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {ngSkipHydration: 'true'},
})
export class HeaderComponent {
  private modalService = inject(NgbModal);

	open(content: TemplateRef<any>) {
		this.modalService.open(content, { backdrop: 'static', 
                                      animation: true, 
                                      centered: true }).result.then();
	}
}
