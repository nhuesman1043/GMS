import { Component, EventEmitter, Output } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

// Components
import { UserSidebarContentComponent } from './user-sidebar-content/user-sidebar-content.component';
import { SextonSidebarContentComponent } from './sexton-sidebar-content/sexton-sidebar-content.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,

    // Components
    UserSidebarContentComponent,
    SextonSidebarContentComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('sidebarAnimation', [
      state('collapsed', style({
        width: '0',
        transform: 'translateX(-100%)'
      })),
      state('expanded', style({
        width: '30vw', // Width of sidebar
        transform: 'translateX(0)' 
      })),
      transition('collapsed => expanded', [
        animate('0.4s')
      ]),
      transition('expanded => collapsed', [
        animate('0.4s')
      ])
    ])
  ]
})
export class SidebarComponent {
  @Output() sidebarToggled = new EventEmitter<boolean>();
  isCollapsed: boolean = true;

  // Toggle the sidebar
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.sidebarToggled.emit(this.isCollapsed);
  }
}
