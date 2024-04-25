import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import {GoogleMap} from '@angular/google-maps';
import { GoogleMapsModule } from '@angular/google-maps'
import { trigger, state, style, animate, transition } from '@angular/animations';
import { APIService } from '../services/api.service';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    GoogleMap,
    GoogleMapsModule,
    NgFor
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
  ]
})

export class MapComponent {
  @Input() isSidebarCollapsed: boolean = true;
  
  constructor(private apiService: APIService) { } 
  plotData: any;
  coordinates: any;

  options: google.maps.MapOptions = {
    center: { lat: 46.6537, lng: -96.4405 },
    zoom: 19,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    keyboardShortcuts: false,
    rotateControl: true,
    //heading: 90,
    restriction: {latLngBounds: {north: 46.6551803, south: 46.6520219, west: -96.4423670, east: -96.4394105}}
  };

  icon = {
    path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
    fillColor: '#FF0000',
    fillOpacity: .6,
    strokeWeight: 0,
    scale: 1
  }

  marker = {
    //content: this.renderer.createElement('div'),
    position: { lat: 46.6537, lng: -96.4405 },
    label: "Susy Mae",
    icon: this.icon,
 }

  async ngOnInit(): Promise<void> {
    // Call the getData method of ApiService to fetch plot data and then person data based on plot's person_id value
    this.plotData = await this.apiService.getData('plots');
    let list = [];
    console.log(this.plotData[0].plot_latitude)
    for (let i = 0; i < this.plotData.length; i++){
      list.push({ lat: parseFloat(this.plotData[i].plot_latitude), lng: parseFloat(this.plotData[i].plot_longitude) });
    }
    this.coordinates = list
  }

  testClick(plot_id: number): void {
    console.log("CLicked " + plot_id)
  }
}

