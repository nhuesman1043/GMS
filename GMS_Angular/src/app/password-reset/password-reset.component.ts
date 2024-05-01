import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
  email: string = '';

  constructor(private http: HttpClient) { }

  submitForm(event: Event) {
    event.preventDefault();
    this.http.post<any>('http://localhost:8000/API/password-reset/', { email: this.email }).subscribe(
      response => {
        console.log(response); // Handle success response
        alert('Password reset email sent');
        this.email = '';
        return false; 
      },
      error => {
        console.error(error); // Handle error response
        alert('Error sending password reset email');
      }
    );
  }
}
