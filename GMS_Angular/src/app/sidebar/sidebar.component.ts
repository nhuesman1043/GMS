import { Component, Input, SimpleChanges} from '@angular/core';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { APIService } from '../services/api.service';

// Components
import { UserSidebarContentComponent } from './user-sidebar-content/user-sidebar-content.component';
import { SextonSidebarContentComponent } from './sexton-sidebar-content/sexton-sidebar-content.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgIf,

    // Components
    UserSidebarContentComponent,
    SextonSidebarContentComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('sidebarAnimation', [
      state('collapsed', style({
        transform: 'translateX(100%)',
        visibility: 'hidden',
        zIndex: '-1'
      })),
      state('expanded', style({
        transform: 'translateX(0)',
        visibility: 'visible',
        zIndex: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
})
export class SidebarComponent {
  constructor(private apiService: APIService) {}

  // Play animation when isSidebarCollapsed is changed
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isSidebarCollapsed']) { 
      this.sidebarState = this['isSidebarCollapsed'] ? 'collapsed' : 'expanded';
    }
  }

  // Sidebar state stuff
  isCollapsed: boolean = true;
  @Input() isSidebarCollapsed: boolean = true;
  sidebarState: string = 'collapsed';             // Initial state

  // Check for Sexton
  isSexton = this.apiService.isSexton();
}
