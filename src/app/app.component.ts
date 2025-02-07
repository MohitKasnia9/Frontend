import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

@Component({
  selector: 'app-root',
  standalone: true, // This indicates a standalone component
  imports: [
    RouterOutlet, // Enables routing in your app
    LoginComponent, // Include LoginComponent
    SignupComponent, // Include SignupComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'myapp';
}
