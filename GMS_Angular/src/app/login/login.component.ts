import { Component } from '@angular/core';
import { APIService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private router: Router, private apiService: APIService) {}

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await this.apiService.login(username, password);
      // Handle successful login response (redirect, store tokens, etc.)
      console.log('Login successful:', response);
      this.router.navigate(['/']); 

    } catch (error) {
      this.loginError = 'Invalid username or password.';
      console.error('Login error:', error);
    }
  }
}
