import { Component, Input } from '@angular/core';
import {GoogleMap} from '@angular/google-maps';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    GoogleMap
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
  
  options: google.maps.MapOptions = {
    center: { lat: 46.6537, lng: -96.4405 },
    zoom: 19,
    mapTypeId: "satellite",
    disableDefaultUI: true,
    keyboardShortcuts: false,
  };
}

