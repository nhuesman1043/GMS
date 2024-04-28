import { Component, inject, EventEmitter, HostListener, Output } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { InfoPopupService } from '../info-popup/info-popup.service';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [WeatherWidgetComponent,
    MatDialogModule,
    InfoPopupComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {ngSkipHydration: 'true'},
  styles: '.light-blue-backdrop {background-color: #5cb3fd;}'
})
export class HeaderComponent {
  constructor(private dialog: MatDialog) {}
  private modalService = inject(NgbModal);

  openModel(){
    console.log('popup started');

        this.dialog.open(InfoPopupComponent, { backdropClass: 'light-blue-backdrop' });
        console.log('popup ended');
   }
  
}
