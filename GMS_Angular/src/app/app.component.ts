import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  // Collaspe sidebar by default
  isSidebarCollapsed: boolean = true;

  // Toggle the sidebar
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
