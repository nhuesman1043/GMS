import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoPopupComponent } from './info-popup.component';

@Injectable({
  providedIn: 'root'
})
export class InfoPopupService {
  constructor(private dialog: MatDialog) {}

  openInfoPopup() {
    this.dialog.open(InfoPopupComponent);
  }
}
