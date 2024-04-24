import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  constructor(private http: HttpClient, private globalService: GlobalService) {}

  // getData method takes a url from Django and returns all data pertaining to it
  async getData(endpoint: string): Promise<any> {
    try {
      // Build url based on global API_URL and given endpoint
      const url = this.globalService.API_URL + endpoint;

      // Fetch data
      const data = await firstValueFrom(this.http.get(url));
      return data;
    } 
    catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  }

  // postData method

  // putData method

  // deleteData method

}
