import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// Global variables
export class GlobalService {
  // Backend API URL
  // UPDATE WHEN DEPLOYED
  API_URL: string = 'http://localhost:8000/API/';

  // URL to images stored in backend
  IMAGE_URL = this.API_URL + 'image';

  // Color of plots for users
  USER_PLOT_COLOR = '#7A8A8B';
}
