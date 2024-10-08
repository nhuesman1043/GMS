import { Component, Input, ElementRef } from '@angular/core';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import {GoogleMap} from '@angular/google-maps';
import { GoogleMapsModule } from '@angular/google-maps'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { APIService } from '../services/api.service';
import { AppComponent } from '../app.component';
import { SidebarService } from '../services/sidebar.service';
import { GlobalService } from '../services/global.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    GoogleMap,
    GoogleMapsModule,
    NgFor,
    NgStyle,
    NgIf,
    NgbModule,
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
    private sanitizer: DomSanitizer, 
    private elementRef: ElementRef,
    private apiService: APIService, 
    private app: AppComponent, 
    private sidebarService: SidebarService, 
    private mapService: MapService,
    private globalService: GlobalService
  ) { } 

  // Define variables
  @Input() isSidebarCollapsed: boolean = true;
  plotData: any;
  plotStatusData: any;
  personData: any;
  plots: any;
  lastSelectedPlotId: Number = -1;
  selectedPlotIndex: number = -1;
  isClearable: boolean = false;
  filterProperty: string = "Person\'s Name";
  personFilter: string = "Person\'s Name";
  identifierFilter: string = "Plot Identifier";
  statusFilter: string = "Plot State";
  isSexton = this.apiService.isSexton();
  nameList: any;
  
  // This method creates the icon for the plots using an svg string
  plotIcon(plotColor: string, isSelected: boolean, opacity: any, personName: string): any {
    let svgString: string = '';

    // Show global plot color for users
    if (!this.isSexton)
      plotColor = this.globalService.USER_PLOT_COLOR;

    // Check for selected
    if (isSelected) {
      // Make the icon have a white border if selected
      svgString = '<svg width="30" height="30" viewBox="0 0 488 428" xmlns="http://www.w3.org/2000/svg">' +
                    '<g transform="translate(163.51 120.39)">' +
                        '<path d="m80.488-116.39c-81.822 0-150 63.366-150 150v150c0 6.668-0.757 23.558 0 30h300c0.757-6.442 0-23.332 0-30v-150c0-86.634-68.178-150-150-150zm-240 360v60h480v-60z" ' +
                            'stroke="#fff" ' +
                            'stroke-linejoin="round" ' +
                            'stroke-width="24" ' +
                            'style="paint-order:normal" ' +
                            'fill="' + plotColor + '" ' +
                            'opacity="' + opacity + '" />' +
                    '</g>' +
                    '<style>' +
                        '.popup {' +
                          'white-space: nowrap;' +
                          'min-width: fit-content;' +
                          'left: 50%;' +
                          'display: none;' +
                          'position: absolute;' +
                          'background-color: #FFFFFF;' +
                          'color: #000000;' +
                          'padding: 5px;' +
                          'border-radius: 5px;' +
                          'z-index: 20;' +
                        '}' +
                        '.popup::after {' +
                            'content: "";' +
                            'position: absolute;' +
                            'bottom: -10px;' +
                            'left: 50%;' +
                            'margin-left: -5px;' +
                            'border-width: 5px;' +
                            'border-style: solid;' +
                            'border-color: #FFFFFF transparent transparent transparent;' +
                        '}' +
                        'svg:hover + .popup {' +
                            'min-width:fit-content;' +
                            'display: block;' +
                            'top:-35px;' +
                            'z-index:20;' +
                            'transform:translateX(-50%)' +
                        '}' +
                    '</style>' +
                '</svg>' +
                '<div class="popup">' + personName + '</div>';
    }
    else {
      // Make the icon have a black border if not selected
      svgString = '<svg width="30" height="30" viewBox="0 0 488 428" xmlns="http://www.w3.org/2000/svg">' +
                    '<g transform="translate(163.51 120.39)">' +
                        '<path d="m80.488-116.39c-81.822 0-150 63.366-150 150v150c0 6.668-0.757 23.558 0 30h300c0.757-6.442 0-23.332 0-30v-150c0-86.634-68.178-150-150-150zm-240 360v60h480v-60z" ' +
                            'stroke="#000" ' +
                            'stroke-linejoin="round" ' +
                            'stroke-width="24" ' +
                            'style="paint-order:normal" ' +
                            'fill="' + plotColor + '" ' +
                            'opacity="' + opacity + '" />' +
                    '</g>' +
                    '<style>' +
                        '.popup {' +
                          'white-space: nowrap;' +
                          'min-width: fit-content;' +
                          'left: 50%;' +
                          'display: none;' +
                          'position: absolute;' +
                          'background-color: #FFFFFF;' +
                          'color: #000000;' +
                          'padding: 5px;' +
                          'border-radius: 5px;' +
                          'z-index: 20;' +
                        '}' +
                        '.popup::after {' +
                            'content: "";' +
                            'position: absolute;' +
                            'bottom: -10px;' +
                            'left: 50%;' +
                            'margin-left: -5px;' +
                            'border-width: 5px;' +
                            'border-style: solid;' +
                            'border-color: #FFFFFF transparent transparent transparent;' +
                        '}' +
                        'svg:hover + .popup {' +
                            'min-width:fit-content;' +
                            'display: block;' +
                            'top:-35px;' +
                            'z-index:20;' +
                            'transform:translateX(-50%)' +
                        '}' +
                    '</style>' +
                '</svg>' +
                '<div class="popup">' + personName + '</div>';
    }

    // Sanitize, format, and return an HtmlElement using the svg string
    const sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(svgString);
    const container = this.elementRef.nativeElement.ownerDocument.createElement('div');
    let htmlstring: string = sanitizedHtml.toString().replace('SafeValue must use [property]=binding: ', '').replace(' (see https://g.co/ng/security#xss)', '');
    container.innerHTML = htmlstring;
    return container;
  }
  
  // Define options/settings for the google map api
  options: google.maps.MapOptions = {
    center: { lat: 46.653050, lng: -96.4400290 },
    zoom: 19,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    keyboardShortcuts: false,
    rotateControl: true,
    restriction: {latLngBounds: {north: 46.654132, south: 46.651956, west: -96.441425, east: -96.438958}},
    minZoom: 19,
    maxZoom: 21,
    isFractionalZoomEnabled: true,
  };

  // Method for refreshing the maps and plots
  async refreshMap(searchField: string): Promise<void> {
    // Get plots and plot status from database
    this.plotData = await this.apiService.getData('plots');
    this.plotStatusData = await this.apiService.getData('plot_statuses');
    this.personData = await this.apiService.getData('persons');
    let list = [];
    this.nameList = [];

    // Loop through each plot in the database and format data
    for (let i = 0; i < this.plotData.length; i++){
      // Get plot color
      const plotState = this.plotData[i].plot_state;
      let plotColor = this.plotStatusData.find((status: any) => status.status_id === plotState)?.color_hex;

      // Generic user plot color
      if (!this.isSexton)
        plotColor = this.globalService.USER_PLOT_COLOR;

      //Check to see if plot meets filter conditions
      if(this.searchFilter(searchField, i)) {
        // Format plot information to be used in html markes that meet search criteria
        if (this.isSexton || plotState === 2){
          // If there is a person in the plot
          if (this.plotData[i].person_id !== null) {
            list.push({ 
              lat: parseFloat(this.plotData[i].plot_latitude)
            , lng: parseFloat(this.plotData[i].plot_longitude)
            , plotId: parseInt(this.plotData[i].plot_id)
            , plotState: this.plotData[i].plot_state
            , plotName: this.plotData[i].plot_identifier 
            , plotColor: this.plotStatusData[this.plotData[i].plot_state - 1].color_hex
            , plotPersonId: this.plotData[i].person_id
            , icon: this.plotIcon(plotColor, false, 1, this.getFullName(i))
          });
          }
          else {
            // If there is not a person in the plot
            this.getFullName(i)
            list.push({ 
              lat: parseFloat(this.plotData[i].plot_latitude)
            , lng: parseFloat(this.plotData[i].plot_longitude)
            , plotId: parseInt(this.plotData[i].plot_id)
            , plotState: this.plotData[i].plot_state
            , plotName: this.plotData[i].plot_identifier 
            , plotColor: this.plotStatusData[this.plotData[i].plot_state - 1].color_hex
            , plotPersonId: this.plotData[i].person_id
            , icon: this.plotIcon(plotColor, false, 1, 'Empty')
          });
          }
        }
      }
      else {
        // If plot does not meet search criteria, make it grey and translucent
        if (this.isSexton || plotState === 2){
          // If there is a person in the plot
          if (this.plotData[i].person_id !== null) {
          list.push({ 
              lat: parseFloat(this.plotData[i].plot_latitude)
            , lng: parseFloat(this.plotData[i].plot_longitude)
            , plotId: parseInt(this.plotData[i].plot_id)
            , plotState: this.plotData[i].plot_state
            , plotName: this.plotData[i].plot_identifier 
            , plotColor: 'lightgrey'
            , plotPersonId: this.plotData[i].person_id
            , icon: this.plotIcon('lightgrey', false, 0.33, this.getFullName(i))
          });  
          }
          // If there is not a person in the plot
          else {
            this.getFullName(i)
            list.push({ 
              lat: parseFloat(this.plotData[i].plot_latitude)
            , lng: parseFloat(this.plotData[i].plot_longitude)
            , plotId: parseInt(this.plotData[i].plot_id)
            , plotState: this.plotData[i].plot_state
            , plotName: this.plotData[i].plot_identifier 
            , plotColor: 'lightgrey'
            , plotPersonId: this.plotData[i].person_id
            , icon: this.plotIcon('lightgrey', false, 0.33, 'Empty')
          });  
          }
        }
      }
    }

    // Set the list of formatted plots to a global variable
    this.plots = list;
  }

  // Method for checking if a plot has a person that is being searched for
  searchFilter(searchField: any, i: any) {
    let filter = '';
    // Check if plot meets search criteria if searching by person's name
    if(this.filterProperty === this.personFilter) {
    // Get the first and last name of the person in the plot
    if(this.plotData[i].person_id !== null){
      const filteredArray = this.personData.filter((dict: any) => {
        return dict.person_id == this.plotData[i].person_id;});
        filter = (filteredArray[0].first_name + " " + filteredArray[0].last_name).toLowerCase();
    }
    }
    // Check if plot meets search criteria if searching by plot identifier
    else if(this.filterProperty === this.identifierFilter) {
        filter = this.plotData[i].plot_identifier.toLowerCase();
    }
    // Check if plot meets search criteria if searching by plot status
    else if(this.filterProperty === this.statusFilter) {
      console.log
      return searchField === this.plotData[i].plot_state;
    }

    // Check if clear button needs to be enabled
    if(searchField !== '')
      this.isClearable = true;

    // Check if plot is to be filtered out or not
    return filter.includes(searchField.toLowerCase()) || searchField === '';
  }

  // Method for getting full name of a person in a plot
  getFullName(i: any) {
    let filter = '';
    // Get the first and last name of the person in the plot if filtering by name
    if(this.plotData[i].person_id !== null){
      const filteredArray = this.personData.filter((dict: any) => {
        return dict.person_id == this.plotData[i].person_id;});
        filter = filteredArray[0].first_name + " " + filteredArray[0].last_name;
        this.nameList.push(filter);
    }
    // If plot is not occupied, make popup text "Empty"
    else {
      this.nameList.push('Empty');
    }
    return filter
  }

  // Sets the state of the clear button and refreshes map
  setClearButtonReset(state: any) {
    this.isClearable = state;
    this.refreshMap('');
  }

  // Method for toggling sidebar based on selected plotId, lastSelectedPlotId, and statusId
  selectPlot(plotId: number, index: number) {
    this.selectedPlotIndex = index;
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