import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient, private globalService: GlobalService, private router: Router) {}

  // Log in the user
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

  // Check if user is Sexton
  isSexton(): boolean {
    return !!this.getToken();
  }

  // Set the token for authentification
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get the token for authentification
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null; // Or handle the absence of localStorage as needed
  }

  async logout(): Promise<void> {
    // Perform logout actions such as clearing tokens or session data
    localStorage.removeItem('auth_token');
  }

  // GetData method takes a url from Django and returns all data pertaining to it
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

  // PostData method takes a url from Django and a body (consists of all the needed attributes of a model) and creates an entry in the database
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

  // PutData method takes a url from Django and a body (consists of all the attributes to update of a model) and updates an entry in the database
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

  // DeleteData method takes a url from Django and deletes its corresponding data
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

  // Upload an image file
  async uploadFile(endpoint: string, formData: FormData): Promise<any> {
    try {
      // Build url based on global IMAGE_URL and given endpoint
      const url = this.globalService.API_URL + endpoint;

      // Upload image
      const response = await firstValueFrom(this.http.post(url, formData));
      return response;
    } catch (error) {
      console.error('Error uploading file: ', error);
      throw error; 
    }
  }
}
