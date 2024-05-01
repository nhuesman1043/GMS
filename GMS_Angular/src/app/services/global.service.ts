import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// Global variables
export class GlobalService {
  // Backend URL
  // UPDATE WHEN DEPLOYED
  API_URL: string = 'http://localhost:8000/API/';

  // URL to images stored in backend
  IMAGE_URL = this.API_URL + 'image';

  // Flag variable for Sexton
  //IS_SEXTON: boolean = false;
}
