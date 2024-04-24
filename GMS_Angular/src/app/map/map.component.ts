import { Component, Input, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
//import {GoogleMap} from '@angular/google-maps';
import { GoogleMapsModule } from '@angular/google-maps'
import { trigger, state, style, animate, transition } from '@angular/animations';

// @Injectable({
//   providedIn: 'root'
// })

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    //GoogleMap,
    GoogleMapsModule
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

  //constructor(private renderer: Renderer2){
  //}
  
  options: google.maps.MapOptions = {
    center: { lat: 46.6537, lng: -96.4405 },
    zoom: 19,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    keyboardShortcuts: false,
    rotateControl: true,
    heading: 90,
    restriction: {latLngBounds: {north: 46.6551803, south: 46.6520219, west: -96.4423670, east: -96.4394105}}
  };

  marker = {
    //content: this.renderer.createElement('div'),
    position: { lat: 46.6537, lng: -96.4405 },
 }
}

