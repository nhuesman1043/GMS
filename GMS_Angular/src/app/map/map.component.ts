import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import {GoogleMap} from '@angular/google-maps';
import { GoogleMapsModule } from '@angular/google-maps'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { APIService } from '../services/api.service';
import { AppComponent } from '../app.component';
import { SidebarService } from '../services/sidebar.service';
import { GlobalService } from '../services/global.service';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    GoogleMap,
    GoogleMapsModule,
    NgFor,
    NgStyle,
    NgIf
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  animations: [
    trigger('mapAnimation', [
      state('collapsed', style({
        width: '100vw',
      })),
      state('expanded', style({
        width: 'calc(100vw - 35vw)' // Subtract by width of sidebar
      })), 
      transition('collapsed <=> expanded', [
        animate('0.5s ease-in-out')
      ])
    ])
  ],
  host: {ngSkipHydration: 'true'},
})

export class MapComponent {  
  // Define a constructor to load services and AppComponent methods
  constructor(
    private apiService: APIService, 
    private app: AppComponent, 
    private sidebarService: SidebarService, 
    private globalService: GlobalService,
    private mapService: MapService
  ) { } 

  // Define variables
  @Input() isSidebarCollapsed: boolean = true;
  plotData: any;
  plotStatusData: any;
  plots: any;
  lastSelectedPlotId: Number = -1;
  isSexton: boolean = this.globalService.IS_SEXTON;
  plotIcon(plotColor: string): any {
    return {
      path: "M0 100c-81.822 0-150 63.366-150 150v150c0 6.668-.757 23.558 0 30h300c.757-6.442 0-23.332 0-30V250c0-86.634-68.178-150-150-150zM-245 466v60h480v-60H0z",
      fillColor: plotColor,
      fillOpacity: 0.85,
      strokeWeight: 0,
      scale: 0.05
    };
  }
  
  //Define options/settings for the google map api
  options: google.maps.MapOptions = {
    center: { lat: 46.6537, lng: -96.4405 },
    zoom: 19,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    keyboardShortcuts: false,
    rotateControl: true,
    restriction: {latLngBounds: {north: 46.6551803, south: 46.6520219, west: -96.4423670, east: -96.4394105}},
    minZoom: 19
  };

  async refreshMap(searchField: string): Promise<void> {
    //Get plots and plot status from database
    this.plotData = await this.apiService.getData('plots');
    this.plotStatusData = await this.apiService.getData('plot_statuses');
    let list = [];

    // Loop through each plot in the database and format data
    for (let i = 0; i < this.plotData.length; i++){
      // Get plot color
      const plotState = this.plotData[i].plot_state;
      const plotColor = this.plotStatusData.find((status: any) => status.status_id === plotState)?.color_hex;

      // Format plot information to be used in html markes
      list.push({ 
          lat: parseFloat(this.plotData[i].plot_latitude)
        , lng: parseFloat(this.plotData[i].plot_longitude)
        , plotId: parseInt(this.plotData[i].plot_id)
        , plotState: this.plotData[i].plot_state
        , plotName: this.plotData[i].plot_identifier 
        , plotColor: this.plotStatusData[this.plotData[i].plot_state - 1].color_hex
        , plotPersonId: this.plotData[i].person_id
        , icon: this.plotIcon(plotColor)
      });  
    }

    // Set the list of formatted plots to a global variable
    this.plots = list;
  }

  // Method for toggling sidebar based on selected plotId, lastSelectedPlotId, and statusId
  selectPlot(plotId: number) {
    // Detect whether or not this is a new plotID and if so, then continue
    if (this.lastSelectedPlotId !== plotId) {
      // Set lastSelectedPlotID to selected plotID
      this.lastSelectedPlotId = plotId;
  
      // Define a function to toggle the sidebar after data is loaded
      const toggleSidebarWithData = () => {
        // Set data and then open sidebar
        this.sidebarService.toggleSidebar(plotId, true);
        this.app.toggleSidebar(plotId);
      };

      // If the sidebar is already open, close it, wait, then reopen it with new info
      if (!this.app.isSidebarCollapsed) {
        // Close sidebar
        this.app.toggleSidebar(plotId);

        // Wait for a short duration for a smooth effect and then reopen with new data
        setTimeout(toggleSidebarWithData, 750);
      } 
      
      // If it's closed, just open it with data
      else 
        toggleSidebarWithData();
    } 
    
    // Just toggle if we're opening/closing the same plot
    else 
      this.app.toggleSidebar(plotId);
  }

  // Method to create a list of plots to load onto map
  async ngOnInit(): Promise<void> {
    this.refreshMap('');
    this.mapService.mapInstance = this;
  }
}