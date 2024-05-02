import { Component, OnInit } from '@angular/core';
import { NgIf, NgStyle, DatePipe, formatDate } from '@angular/common';
import { APIService } from '../../services/api.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-user-sidebar-content',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    NgStyle
  ],
  templateUrl: './user-sidebar-content.component.html',
  styleUrl: './user-sidebar-content.component.scss'
})
export class UserSidebarContentComponent implements OnInit {
  constructor(private apiService: APIService, private sidebarService: SidebarService) { } 
  // Variables to hold pulled in plot data and person data
  plotData: any;
  personData: any;
  portraitImage: any;
  landscapeImage: any;

  ngOnInit() {
    this.sidebarService.sidebarToggled$.subscribe((id: number) => {
      // Call getUserContentData method when sidebar is toggled
      this.getUserContentData(id);
    });
  }

  async getUserContentData(plotId: number): Promise<void> {
    try {
      // Set dataLoaded to false when starting to get user data
      this.sidebarService.setDataLoadedStatus(false, true);

      // Call the getData method of ApiService to fetch plot data and then person data based on plot's person_id value
      this.plotData = await this.apiService.getData('plot/' + plotId + '/');
      this.personData = await this.apiService.getData('person/' + this.plotData.person_id + '/');

      // Get images based on API_URL/imageURL and their file name - Set to null and then check
      // Initialize image URLs to null before fetching new ones
      this.portraitImage = null;
      this.landscapeImage = null;

      // Check if there is an available portait image and if so, set value
      if (this.personData.portrait_image !== null)
        this.portraitImage = this.personData.portrait_image_url;

      // Check if there is an available landscape image and if so, set value
      if (this.personData.landscape_image !== null)
        this.landscapeImage = this.personData.landscape_image_url;

      // Set dataLoaded to true when data is fetched
      this.sidebarService.setDataLoadedStatus(true, true);
    } catch(err) {
      // Show error and set data loaded to false
      console.error('Error fetching user content data:', err);
      this.sidebarService.setDataLoadedStatus(false, false);
    }
  }

  // Format date range
  formatDateRange(startDate: Date, endDate: Date): string {
    const formattedStartDate = formatDate(startDate, 'mediumDate', 'en-US');
    const formattedEndDate = formatDate(endDate, 'mediumDate', 'en-US');
    return `${formattedStartDate} - ${formattedEndDate}`;
  }
}
