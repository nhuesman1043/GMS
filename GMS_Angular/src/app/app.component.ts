import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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

    // Components
    HeaderComponent,
    MapComponent,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Collaspe sidebar by default
  isSidebarCollapsed: boolean = true;
  
  onSidebarToggled(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
