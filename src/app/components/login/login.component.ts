import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  // Validators,
  AbstractControl,
  ValidationErrors,

  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginMessage: string = '';
  isSuccess: boolean | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,  // Inject AuthService
    private router: Router  // Inject Router for redirection after login
  ) {
    this.loginForm = new FormGroup({
      // email: new FormControl('', [Validators.required, Validators.email]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        this.docquityEmailValidator,
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }
  docquityEmailValidator(control: AbstractControl): ValidationErrors | null {
      const email = control.value;
      return email && email.endsWith('@docquity.com')
        ? null
        : { invalidEmailDomain: true };
    }
  

  ngOnInit(): void {
    try {
      console.log("run");
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get('http://localhost:3000/auth/dashboard', { headers }).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Invalid token:', err);
          localStorage.removeItem('token'); 
        },
      });
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData.email, loginData.password).subscribe({
        next: (response: any) => {
          this.isSuccess = true;
          this.loginMessage = 'Successfully logged in!';

          // Store the JWT token after login
          this.authService.setToken(response.access_token);

          // Redirect user to the dashboard
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.isSuccess = false;
          this.loginMessage = 'Invalid credentials! Please try again.';
        },
      });
    } else {
      this.isSuccess = false;
      this.loginMessage = 'Please fill in all fields!';
    }
  }
}
