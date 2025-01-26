import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  userForm: FormGroup = new FormGroup({
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
      Validators.pattern(/^(?=.*[A-Za-z])[A-Za-z0-9_]+$/), 
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
    mobile: new FormControl('', [Validators.required]),
    country: new FormControl('+91', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  
  docquityEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    return email && email.endsWith('@docquity.com') ? null : { invalidEmailDomain: true };
  }


  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  
  onUserSave() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
