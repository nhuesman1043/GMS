import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarToggledSource = new Subject<Number>();

  sidebarToggled$ = this.sidebarToggledSource.asObservable();

  toggleSidebar(plotId: Number) {
    this.sidebarToggledSource.next(plotId);
  }
}
