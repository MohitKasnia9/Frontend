import { ComponentFixture, TestBed ,fakeAsync,tick} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Token } from '@angular/compiler';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let http: HttpClient;
  let httpMock: HttpTestingController;
   
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, LoginComponent], // Import LoginComponent here
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    http=TestBed.inject(HttpClient);
    httpMock:TestBed.inject(HttpTestingController);
  });
  afterEach(async ()=>{
    
  });

  it('should verify token on ngOnInit if token exists', fakeAsync(()=>{
    spyOn(localStorage,'getItem').and.returnValue('token');
    const spyHttp=spyOn(http,'get').and.returnValue(of({}));
    component.ngOnInit();
    tick();
    const headers=new HttpHeaders().set('Authorization','Bearer token');
    expect(spyHttp).toHaveBeenCalledWith('http://localhost:3000/auth/dashboard',{headers});
    expect(router.navigate(['/dashboard']));

  }))

  it('should redirect to login if token fails', fakeAsync(()=>{
    spyOn(localStorage,'getItem').and.returnValue('token');
    const spyHttp=spyOn(http,'get').and.returnValue(throwError({status:401}));
    component.ngOnInit();
    tick();
    const headers=new HttpHeaders().set('Authorization','Bearer token');
    expect(spyHttp).toHaveBeenCalledWith('http://localhost:3000/auth/dashboard',{headers});
    expect(router.navigate(['/login']));
    localStorage.removeItem('token');
    expect(spyHttp).not.toHaveBeenCalledWith('http://localhost:3000/auth/dashboard');


  }))

  it('should create component',()=>{
    expect(component).toBeTruthy;
  })

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });


  it('should give invalid if form is details are not filled',()=>{
    let email=component.loginForm.controls['email'];
    email.setValue('');
    expect(email.valid).toBeFalsy();
    email.setValue('mohit@docquity.com');
    expect(email.valid).toBeTruthy();

    let password=component.loginForm.controls['password'];
    password.setValue('');
    expect(password.valid).toBeFalsy();
    password.setValue('Docquity@1234');
    expect(password.valid).toBeTruthy();

    
  })

  it('should check the validity of email and password', fakeAsync(()=>{
    spyOn(authService,'login').and.returnValue(of({access_token :'token'}));
    spyOn(authService, 'setToken').and.callThrough();

    const spyHttp=spyOn(http,'get').and.returnValue(of({}));
    component.loginForm.setValue({email: 'mohit@docquity.com',password: 'Docquity@1234'});
    component.onLogin();
    expect(authService.login).toHaveBeenCalledWith('mohit@docquity.com','Docquity@1234');
    expect(authService.setToken).toHaveBeenCalledWith('token');

    expect(router.navigate(['/dashboard']));


  }))

  it('checking response when email and password are invalid', fakeAsync(()=>{
    spyOn(authService,'login').and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.loginForm.setValue({email: 'mohit@docquity.com',password: 'Docquity@1234'});
    component.onLogin();
    expect(authService.login).toHaveBeenCalledWith('mohit@docquity.com','Docquity@1234');
    
    expect(component.isSuccess).toBeFalsy();
  }))

  it('should show fill all details if all details are not filled and form is submitted',()=>{
    spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Please fill in all fields!')));
    component.onLogin();
    expect(component.isSuccess).toBeFalse();
    expect(component.loginMessage).toBe('Please fill in all fields!');


  })
});

