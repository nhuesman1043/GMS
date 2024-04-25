import { Component, Input, Output, EventEmitter } from '@angular/core';
import {GoogleMap} from '@angular/google-maps';
import { GoogleMapsModule } from '@angular/google-maps'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { APIService } from '../services/api.service';
import { NgFor } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    GoogleMap,
    GoogleMapsModule,
    NgFor,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  animations: [
    trigger('mapAnimation', [
      state('sidebarCollapsed', style({
        width: '100vw',
      })),
      state('sidebarExpanded', style({
        width: 'calc(100vw - 30vw)', // Subtract by width of sidebar
      })),
      transition('sidebarCollapsed => sidebarExpanded', [
        animate('0.4s')
      ]),
      transition('sidebarExpanded => sidebarCollapsed', [
        animate('0.4s')
      ])
    ])
  ]
})

export class MapComponent {
  @Input() isSidebarCollapsed: boolean = true;
  @Output() sidebarToggled = new EventEmitter<boolean>();
  isCollapsed: boolean = true;
  
  constructor(private apiService: APIService) { } 
  plotData: any;
  plotStatusData: any;
  coordinates: any;
  
  options: google.maps.MapOptions = {
    center: { lat: 46.6537, lng: -96.4405 },
    zoom: 19,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    keyboardShortcuts: false,
    rotateControl: false,
    heading: 90,
    restriction: {latLngBounds: {north: 46.6551803, south: 46.6520219, west: -96.4423670, east: -96.4394105}}
  };

//   icon = {
//     path: "M0 100c-81.822 0-150 63.366-150 150v150c0 6.668-.757 23.558 0 30h300c.757-6.442 0-23.332 0-30V250c0-86.634-68.178-150-150-150zM-245 466v60h480v-60H0z",
//     fillColor: '#6AA2BF',
//     fillOpacity: .95,
//     strokeWeight: 0,
//     scale: 0.1
// };


  marker = {
  position: { lat: 46.6537, lng: -96.4405 },
  label: "",
  icon: "",
  plotId: "",
  plotState: "",
  plotName: "",
  plotColor: "",
  plotPersonId: ""
}
//Plot States
// 1 = Availible #26532B
// 2 = Occupied #5C80BC
// 3 = Reserved #E89005
// 4 = Inactive #333333

async ngOnInit(): Promise<void> {
  console.log("Start")

  //this.plotData = await this.apiService.getData('plot/1/');
  //this.personData = await this.apiService.getData('person/' + this.plotData.person_id + '/');
  // Call the getData method of ApiService to fetch plot data and then person data based on plot's person_id value

 //array of svg

  this.plotData = await this.apiService.getData('plots');
  this.plotStatusData = await this.apiService.getData('plot_statuses');
  let list = [];

  for (let i = 0; i < this.plotData.length; i++){

    const plotState = this.plotData[i].plot_state;
    const plotColor = this.plotStatusData.find((status: any) => status.status_id === plotState)?.color_hex;
    list.push({ 
        lat: parseFloat(this.plotData[i].plot_latitude)
      , lng: parseFloat(this.plotData[i].plot_longitude)
      , plotId: this.plotData[i].plot_id
      , plotState: this.plotData[i].plot_state
      , plotName: this.plotData[i].plot_identifier 
      , plotColor: this.plotStatusData[this.plotData[i].plot_state - 1].color_hex
      , plotPersonId: this.plotData[i].person_id
      , icon: {
        path: "M0 100c-81.822 0-150 63.366-150 150v150c0 6.668-.757 23.558 0 30h300c.757-6.442 0-23.332 0-30V250c0-86.634-68.178-150-150-150zM-245 466v60h480v-60H0z",
        fillColor: plotColor,
        fillOpacity: 0.95,
        strokeWeight: 0,
        scale: 0.1
      }
    
    });
    
  }
  this.coordinates = list;

  console.log(this.coordinates);
}


toggleSidebar(coord: any) {
  console.log('You clicked on plot: ' + coord.plotName);
  this.isCollapsed = !this.isCollapsed;
  this.sidebarToggled.emit(this.isCollapsed);
  }

// CODE FOR MAKING POPUP WHEN HOVERING OVER PIN (doesn't work/Expiremental)
//Use the mapmouseover event in html to call viewMessage
// viewMessage(marker: any, mapInstance: any){
//   const contentString =
//   '<div id="content">' +
//   '<div id="siteNotice">' +
//   "</div>" +
//   '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
//   '<div id="bodyContent">' +
//   "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
//   "sandstone rock formation in the southern part of the " +
//   "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
//   "south west of the nearest large town, Alice Springs; 450&#160;km " +
//   "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
//   "features of the Uluru - Kata Tjuta National Park. Uluru is " +
//   "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
//   "Aboriginal people of the area. It has many springs, waterholes, " +
//   "rock caves and ancient paintings. Uluru is listed as a World " +
//   "Heritage Site.</p>" +
//   '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
//   "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
//   "(last visited June 22, 2009).</p>" +
//   "</div>" +
//   "</div>";

// const infowindow = new google.maps.InfoWindow({
//   content: contentString,
//   ariaLabel: "Uluru",
// });

// infowindow.open({
//   anchor: marker,
//   map: mapInstance
// });
// }
}