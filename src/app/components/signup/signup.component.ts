import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
// import {environment} from '../../../environments/environment'
@Component({
  selector: 'app-signup',
  standalone: true, // Declaring as standalone component
  imports: [ReactiveFormsModule, NgIf], // Importing ReactiveFormsModule and NgIf
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  serverError: string | null = null;
  successMessage: string | null = null;

  constructor(private http: HttpClient) {}

  userForm: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]+$/),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]+$/),
      ]),
      userName: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[A-Za-z0-9_]+$/),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        this.docquityEmailValidator,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      country: new FormControl('+91', [Validators.required]),
    },
    { validators: this.passwordMatchValidator }
  );

  docquityEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    return email && email.endsWith('@docquity.com')
      ? null
      : { invalidEmailDomain: true };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword
      ? null
      : { passwordsMismatch: [true,'passwordsMismatch']};
  }

  onUserSave() {
    if (this.userForm.valid) {
      const formData = {
        firstname: this.userForm.value.firstName,
        lastname: this.userForm.value.lastName,
        username: this.userForm.value.userName,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        mobile_number: this.userForm.value.mobile,
        country_code: this.userForm.value.country,
      };

      this.http.post('http://localhost:3000/auth/signup', formData).subscribe({
        next: (res: any) => {
          this.successMessage = 'Registration successful! You can now log in.';
          this.serverError = null;
          this.userForm.reset();
          // const a=environment.apiUrl
        },
        error: (err) => {
          if (err.status === 409) {
            this.serverError = err.error.message || 'User already exists.';
          } else {
            this.serverError =
              'An unexpected error occurred. Please try again later.';
          }
          this.successMessage = null;
        },
      });
    } 
    else {
      console.log('Form is invalid');
    }
  }
  
}
