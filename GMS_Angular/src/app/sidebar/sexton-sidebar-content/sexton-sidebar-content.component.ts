import { Component } from '@angular/core';
import { NgIf, NgStyle, DatePipe, formatDate } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { APIService } from '../../services/api.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sexton-sidebar-content',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './sexton-sidebar-content.component.html',
  styleUrl: './sexton-sidebar-content.component.scss'
})
export class SextonSidebarContentComponent {
  constructor(private apiService: APIService, private globalService : GlobalService, private sidebarService: SidebarService) { } 

  // Variables to hold pulled in plot data and person data
  plotData: any;
  personData: any;


}
