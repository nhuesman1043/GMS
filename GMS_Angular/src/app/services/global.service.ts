import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  API_URL: string = 'http://localhost:8000/API/';

}
