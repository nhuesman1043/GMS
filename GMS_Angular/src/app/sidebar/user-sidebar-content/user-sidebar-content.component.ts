import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { APIService } from '../../services/api.service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-user-sidebar-content',
  standalone: true,
  imports: [
    NgIf,
  ],
  templateUrl: './user-sidebar-content.component.html',
  styleUrl: './user-sidebar-content.component.scss'
})
export class UserSidebarContentComponent implements OnInit {
  constructor(private apiService: APIService, private globalService : GlobalService) { } 
  // Variables to hold pulled in plot data and person data
  plotData: any;
  personData: any;
  portraitImage: any;
  landscapeImage: any;

  async ngOnInit(): Promise<void> {
    // Call the getData method of ApiService to fetch plot data and then person data based on plot's person_id value
    this.plotData = await this.apiService.getData('plot/1/');
    this.personData = await this.apiService.getData('person/' + this.plotData.person_id + '/');

    // Get images based on API_URL/imageURL and their file name
    const imageURL = this.globalService.API_URL + 'image/';
    this.portraitImage = imageURL + this.personData.portrait_image.split('/images/')[1] + '/';
    this.landscapeImage = imageURL + this.personData.landscape_image.split('/images/')[1] + '/';
  }
}
