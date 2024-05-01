import { Component } from '@angular/core';
import { APIService } from '../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { GlobalService } from '../services/global.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private router: Router, private apiService: APIService, private globalService: GlobalService) {}

  navigateToReset() {
    this.router.navigate(['/password-reset']);
  }

  async login(): Promise<void> {
    try {
      const response = await this.apiService.login(this.username, this.password);
      if (response && response.success && response.token) {
        // Handle successful login response by setting global variable and navigate
        //this.globalService.IS_SEXTON = true;
        console.log('Authentication Token:', response.token);
        localStorage.setItem('isLoggedIn', 'true');

        this.apiService.setToken(response.token);
        this.apiService.isSexton(); 
        this.router.navigate(['/']); 
      }
    } catch (error) {
      this.loginError = 'Invalid username or password.';
      console.error('Login error:', error);
    } 
  }
}
