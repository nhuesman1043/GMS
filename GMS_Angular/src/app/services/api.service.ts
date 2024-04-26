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

      // Get data
      const data = await firstValueFrom(this.http.get(url));
      return data;
    } catch (error) {
      console.error('Error getting data: ', error);
      throw error;
    }
    
  }

  async login(username: string, password: string): Promise<any> {
    try {
      const url = this.globalService.API_URL + 'login/'; 
      const body = { username, password };
      const data = await firstValueFrom(this.http.post(url, body));
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    // Perform logout actions such as clearing tokens or session data
    // Example:
    // localStorage.removeItem('auth_token');
  }

  // postData method takes a url from Django and a body (consists of all the needed attributes of a model) and creates an entry in the database
  async postData(endpoint: string, body: any): Promise<any> {
    try {
        // Build url based on global API_URL and given endpoint
        const url = this.globalService.API_URL + endpoint;

        // Post data
        const data = await firstValueFrom(this.http.post(url, body));
        return data;
    } catch (error) {
        console.error('Error creating data: ', error);
        throw error;
    }
  }

  // putData method takes a url from Django and a body (consists of all the attributes to update of a model) and updates an entry in the database
  async putData(endpoint: string, body: any): Promise<any> {
    try {
        // Build url based on global API_URL and given endpoint
        const url = this.globalService.API_URL + endpoint;

        // Put data
        const data = await firstValueFrom(this.http.put(url, body));
        return data;
    } catch (error) {
        console.error('Error updating data: ', error);
        throw error;
    }
  }

  // deleteData method takes a url from Django and deletes its corresponding data
  async deleteData(endpoint: string): Promise<void> {
    try {
        // Build url based on global API_URL and given endpoint
        const url = this.globalService.API_URL + endpoint;

        // Delete data
        await firstValueFrom(this.http.delete(url));
    } catch (error) {
        console.error('Error deleting data: ', error);
        throw error;
    }
  }

  /* 
    Example usage of HTTP methods:
    !! All of these methods must be called in asynchronous functions 
    !! Add "async" before function name ( See examples below ) 

    getData: 
      constructor(private apiService: APIService) { } 
      // Variables to hold pulled in plot data
      plotData: any;

      async ngOnInit(): Promise<void> {
        // Call the getData method of ApiService to fetch all plot data for plot with id of 1
        this.plotData = await this.apiService.getData('plot/1/');

        // Call the getData method of ApiService to fetch all plot data
        this.plotData = await this.apiService.getData('plots/');
      }

    postData:
      async createExample() {
          // Needed fields for creating a person
          const createFields = {
            "first_name": "TEST",
            "last_name": "TEST",
            "date_of_birth": "1956-04-12",
            "date_of_death": "2024-02-20",
            "date_of_burial": "2024-04-23",
            "obituary": "A great TEST",
            "portrait_image": null,
            "landscape_image": null
          }

          // Call the postData method of ApiService to create a person
          await this.apiService.postData('persons/', createFields)
      }

    putData:
      async updateExample() {
        // Needed fields for updating a person
        const updateFields = {
          "first_name": "Henry",
          "last_name": "Doe",
          "date_of_birth": "1956-04-12",
          "date_of_death": "2024-02-20",
          "date_of_burial": "2024-04-23",
          "obituary": "He was a great man...",
          "portrait_image": null,
          "landscape_image": null
        }

        // Call the putData method of ApiService to update person with id 1
        await this.apiService.putData('person/1/', updateFields)
      }

    deleteData:
      async deleteExample() {
        // Call the deleteData method of ApiService to delete person with id 6
        await this.apiService.deleteData('person/6/')
      }
  */
}
