import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';

// Components
import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';

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
    LoginComponent
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
  // Collaspe sidebar by default
  isSidebarCollapsed: boolean = true;

// check if the link is /admin
  isAdminRoute: boolean = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute = this.router.url === '/admin';
      }
    });
  }

  // Toggle the sidebar
  toggleSidebar(id: Number) {
    // Toggle sidebar
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
