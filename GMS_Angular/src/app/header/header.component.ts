import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { InfoPopupService } from '../info-popup/info-popup.service';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';

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
})
export class HeaderComponent {
  constructor(private dialog: MatDialog) {}
  @Output() onClick = new EventEmitter();

  openInfoPopup() {
    this.dialog.open(InfoPopupComponent);
  }

  @HostListener('click')
  openModel(){
    console.log('popup started');
    const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(InfoPopupComponent, dialogConfig);
        console.log('popup ended');
   }
  
}
