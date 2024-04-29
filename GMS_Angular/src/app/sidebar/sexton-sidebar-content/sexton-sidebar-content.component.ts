import { Component, OnInit } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
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
export class SextonSidebarContentComponent implements OnInit {
  constructor(private apiService: APIService, private globalService : GlobalService, private sidebarService: SidebarService) { } 
  // Variables to hold pulled in plot data and person data
  plotData: any;

  async getSextonContentData(plotId: number): Promise<void> {
    try {
      // Set dataLoaded to false when starting to get user data
      this.sidebarService.setDataLoadedStatus(false);

      // Call the getData method of ApiService to fetch plot data and then person data based on plot's person_id value
      this.plotData = await this.apiService.getData('plot/' + plotId + '/');

      // Set dataLoaded to true when data is fetched
      this.sidebarService.setDataLoadedStatus(true);
    } catch(err) {
      // Show error and set data loaded to false
      console.error('Error fetching user content data:', err);
      this.sidebarService.setDataLoadedStatus(false);
    }
  }

  ngOnInit() {
    this.sidebarService.sidebarToggled$.subscribe((id: number) => {
      // Call getUserContentData method when sidebar is toggled
      this.getSextonContentData(id);
    });
  }
}
