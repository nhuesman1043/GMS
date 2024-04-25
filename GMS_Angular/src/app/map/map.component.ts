import { Component, Input, Output, EventEmitter } from '@angular/core';
import {GoogleMap} from '@angular/google-maps';
import { GoogleMapsModule } from '@angular/google-maps'
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    GoogleMap,
    GoogleMapsModule
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
  
  options: google.maps.MapOptions = {
    center: { lat: 46.6537, lng: -96.4405 },
    zoom: 19,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    keyboardShortcuts: false,
    rotateControl: true,
    restriction: {latLngBounds: {north: 46.6551803, south: 46.6520219, west: -96.4423670, east: -96.4394105}}
  };

  marker = {
    //content: this.renderer.createElement('div'),
    position: { lat: 46.6537, lng: -96.4405 },
    label: "Susy Mae",
    icon: "assets/images/gravesmall.png",
 }
}

