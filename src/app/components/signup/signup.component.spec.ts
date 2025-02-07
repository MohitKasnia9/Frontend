import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, SignupComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should validate email field correctly', () => {
    const emailControl = component.userForm.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();
    emailControl.setValue('user@docquity.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should validate password match correctly', () => {
    component.userForm.controls['password'].setValue('Valid@123');
    component.userForm.controls['confirmPassword'].setValue('Valid@123');
    expect(component.userForm.errors).toBeNull();

    component.userForm.controls['confirmPassword'].setValue('Mismatch@123');
    expect(component.userForm.errors).toEqual({ passwordsMismatch: true });
  });

  it('should call API and handle success on valid form submission', () => {
    spyOn(httpClient, 'post').and.returnValue(of({ message: 'User registered' }));

    component.userForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      userName: 'johndoe',
      email: 'john@docquity.com',
      password: 'Valid@123',
      confirmPassword: 'Valid@123',
      mobile: '9876543210',
      country: '+91',
    });

    component.onUserSave();
    expect(httpClient.post).toHaveBeenCalledWith('http://localhost:3000/auth/signup', jasmine.any(Object));
    expect(component.successMessage).toBe('Registration successful! You can now log in.');
    expect(component.serverError).toBeNull();
  });

  it('should handle existing user error on form submission', () => {
    spyOn(httpClient, 'post').and.returnValue(throwError({ status: 409, error: { message: 'User already exists.' } }));

    component.userForm.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      userName: 'janedoe',
      email: 'jane@docquity.com',
      password: 'Valid@123',
      confirmPassword: 'Valid@123',
      mobile: '9876543210',
      country: '+91',
    });

    component.onUserSave();
    expect(component.serverError).toBe('User already exists.');
    expect(component.successMessage).toBeNull();

  });

  it('should handle unexpected server error', () => {
    spyOn(httpClient, 'post').and.returnValue(throwError({ status: 401, error: { message: 'An unexpected error occurred. Please try again later.' } }));

    component.userForm.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      userName: 'janedoe',
      email: 'jane@docquity.com',
      password: 'Valid@123',
      confirmPassword: 'Valid@123',
      mobile: '9876543210',
      country: '+91',
    });

    component.onUserSave();
    expect(component.serverError).toBe('An unexpected error occurred. Please try again later.');
    expect(component.successMessage).toBeNull();
  });

  // it('should handle unexpected server error', () => {
  //   spyOn(httpClient, 'post').and.returnValue(throwError({ status: 401, error: { message: 'An unexpected error occurred. Please try again later.' } }));

  //   component.userForm.setValue({
  //     firstName: 'Jane',
  //     lastName: 'Doe',
  //     userName: 'janedoe',
  //     email: 'jane@docquity.com',
  //     password: 'Valid@123',
  //     confirmPassword: 'Valid@123',
  //     mobile: '9876543210',
  //     country: '+91',
  //   });

  //   component.onUserSave();
  //   expect(component.serverError).toBe('An unexpected error occurred. Please try again later.');
  //   expect(component.successMessage).toBeNull();
  // });
  it('should log form is invalid',()=>{
    const consolespyon=spyOn(console,"log");
  
    component.onUserSave();
  
  
    expect(consolespyon).toHaveBeenCalledOnceWith('Form is invalid');
  
   });
});
