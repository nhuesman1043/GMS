import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { APIService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-user-sidebar-content',
  standalone: true,
  imports: [
    NgIf,
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
    // Call the getData method of ApiService to fetch plot data and then person data based on plot's person_id value
    this.plotData = await this.apiService.getData('plot/' + plotId + '/');
    this.personData = await this.apiService.getData('person/' + this.plotData.person_id + '/');

    // Get images based on API_URL/imageURL and their file name
    const imageURL = this.globalService.API_URL + 'image';
    this.portraitImage = imageURL + this.personData.portrait_image;
    this.landscapeImage = imageURL + this.personData.landscape_image;
  }

  ngOnInit() {
    this.sidebarService.sidebarToggled$.subscribe((id: Number) => {
      // Call getUserContentData method when sidebar is toggled
      this.getUserContentData(id);
    });
  }
}
