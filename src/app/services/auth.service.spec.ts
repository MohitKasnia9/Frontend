import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API and return token', () => {
    const mockResponse = { access_token: 'mockToken' };
    service.login('test@example.com', 'password123').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });

    req.flush(mockResponse);
  });

  it('should call register API', () => {
    const mockResponse = { message: 'User registered successfully' };
    service.register('new@example.com', 'password123').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'new@example.com', password: 'password123' });

    req.flush(mockResponse);
  });

  it('should store and retrieve token', () => {
    service.setToken('testToken');
    expect(localStorage.getItem('token')).toBe('testToken');

    const token = service.getToken();
    expect(token).toBe('testToken');
  });

  it('should generate correct authorization headers', () => {
    spyOn(service, 'getToken').and.returnValue('mockToken');
    const headers = service.getAuthHeaders();
    expect(headers).toEqual(new HttpHeaders().set('Authorization', 'Bearer mockToken'));
  });
});
