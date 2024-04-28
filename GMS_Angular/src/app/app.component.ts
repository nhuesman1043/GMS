import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SidebarService } from './services/sidebar.service';

// Components
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    NgIf,
    NgClass,

    // Components
    HeaderComponent,
    MapComponent,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('toggleAnimation', [
      state('collapsed', style({
        transform: 'translateX(0)',
      })),
      state('expanded', style({
        transform: 'translateX(-35vw)', // Width of sidebar
      })),
      transition('collapsed <=> expanded', [
        animate('0.5s ease-in-out') 
      ])
    ])
  ]
})
export class AppComponent {
  constructor(private sidebarService: SidebarService) {};

  // Collapse sidebar by default
  isSidebarCollapsed: boolean = true;
  isDataLoaded: boolean = false;        // Variable to store data loading status

  // Method to toggle sidebar
  toggleSidebar(id: number) {
    // Subscribe to dataLoaded$ to check if data is loaded
    this.sidebarService.dataLoaded$.subscribe((isLoaded: boolean) => {
      // Store the data loading status
      this.isDataLoaded = isLoaded;

      // Only let user toggle if there is data to display
      if (this.isDataLoaded) {
        // If data is loaded, toggle the sidebar
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
      } 
    });
  }
}
