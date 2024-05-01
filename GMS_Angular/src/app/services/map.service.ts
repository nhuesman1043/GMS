import { Injectable } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  mapInstance: MapComponent | undefined;

  constructor() { }
}
