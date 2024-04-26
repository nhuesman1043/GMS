import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-info-popup',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './info-popup.component.html',
  styleUrl: './info-popup.component.scss'
})
export class InfoPopupComponent {
  
}
