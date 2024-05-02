import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Variables
  private sidebarToggledSource = new Subject<number>();
  private dataLoadedSource = new BehaviorSubject<boolean>(false);
  sidebarToggled$ = this.sidebarToggledSource.asObservable();
  dataLoaded$ = this.dataLoadedSource.asObservable();

  // Toggle sidebar if data has been loaded
  toggleSidebar(plotId: number, isDataLoaded: boolean) {
    if (isDataLoaded) {
      this.sidebarToggledSource.next(plotId);
    } 
  }

  // Set load status and toggle sidebar if warranted
  setDataLoadedStatus(isLoaded: boolean, toggleSidebar: boolean) {
    if (toggleSidebar)
      this.dataLoadedSource.next(isLoaded);
  }
}
