import { Component, OnInit } from '@angular/core';
import { NgIf, NgStyle, DatePipe, formatDate } from '@angular/common';
import { APIService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
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
export class UserSidebarContentComponent implements OnInit{
  constructor(private apiService: APIService, private globalService : GlobalService, private sidebarService: SidebarService) { } 
  // Variables to hold pulled in plot data and person data
  plotData: any;
  personData: any;
  portraitImage: any;
  landscapeImage: any;

  async getUserContentData(plotId: Number): Promise<void> {
    try {
      // Call the getData method of ApiService to fetch plot data and then person data based on plot's person_id value
      this.plotData = await this.apiService.getData('plot/' + plotId + '/');
      this.personData = await this.apiService.getData('person/' + this.plotData.person_id + '/');

      // Get images based on API_URL/imageURL and their file name - Set to null and then check
      // Initialize image URLs to null before fetching new ones
      this.portraitImage = null;
      this.landscapeImage = null;

      // Build imageURL based on API_URL and 'image'
      const imageURL = this.globalService.API_URL + 'image';

      // Check if there is an available portait image and if so, set value
      if (this.personData.portrait_image !== null)
        this.portraitImage = imageURL + this.personData.portrait_image;

      // Check if there is an available landscape image and if so, set value
      if (this.personData.landscape_image !== null)
        this.landscapeImage = imageURL + this.personData.landscape_image;
    } catch(err) {
      console.error('Error fetching user content data:', err);
    }
  }

  ngOnInit() {
    this.sidebarService.sidebarToggled$.subscribe((id: Number) => {
      // Call getUserContentData method when sidebar is toggled
      this.getUserContentData(id);
    });
  }

  formatDateRange(startDate: Date, endDate: Date): string {
    const formattedStartDate = formatDate(startDate, 'mediumDate', 'en-US');
    const formattedEndDate = formatDate(endDate, 'mediumDate', 'en-US');
    return `${formattedStartDate} - ${formattedEndDate}`;
  }
}
