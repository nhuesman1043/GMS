import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// Global variables
export class GlobalService {
  // UPDATE WHEN DEPLOYED
  API_URL: string = 'http://localhost:8000/API/';
}
