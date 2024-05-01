import { Component, NgModule } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SidebarService } from './services/sidebar.service';

// Components
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NbPasswordAuthStrategy, NbAuthModule } from '@nebular/auth';
import { APIService } from './services/api.service';

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
    SidebarComponent,
    LoginComponent,
    PasswordResetComponent
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
  constructor(private apiService: APIService, private sidebarService: SidebarService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute = this.router.url === '/admin';
        this.isPasswordResetRoute = this.router.url === '/password-reset'; 
        this.isRoute = this.router.url === '/'; 
      }
    });
  };

  // Collapse sidebar by default
  isSidebarCollapsed: boolean = true;
  isDataLoaded: boolean = false;        // Variable to store data loading status
  isFirstLoad: boolean = true;          // Variable to show that sidebar toggle is disabled before a plot has been selected

  // Check if the link is /admin
  isAdminRoute: boolean = false;
  isRoute: boolean = false; 
  isPasswordResetRoute: boolean = false; 

  // Method to toggle sidebar
  toggleSidebar(id: number) {
    // Subscribe to dataLoaded$ to check if data is loaded
    this.sidebarService.dataLoaded$.subscribe((isLoaded: boolean) => {
      // Store the data loading status
      this.isDataLoaded = isLoaded;

      // Only let user toggle if there is data to display
      if (this.isDataLoaded) {
          // Show that a user has been selected and that the sidebar toggle can be used
          this.isFirstLoad = false;

        // If data is loaded, toggle the sidebar
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
      } 
    });

  }
}

