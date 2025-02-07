import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';  
import { Token } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone:true,
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  studentList: any[] = [];  
  constructor(private http: HttpClient, private router: Router) {} 

  ngOnInit(): void {
    this.fetchStudentData();  
  }

  fetchStudentData() : void{
    const token = localStorage.getItem('token'); 
 
    if (!token) {
      console.error('No token found!');
      this.router.navigate(['/login']); 
      return;
    }
 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('http://localhost:3000/auth/dashboard', { headers }).subscribe(
      (res: any) => {
        this.studentList = res;
        console.log(this.studentList)
      },
      (err) => {
        console.error("Error fetching student list:", err);
        this.router.navigate(['/login']);
      }
    );
  }

  onLogoutClick(){
    localStorage.clear();
    this.router.navigate(['']);

  }
}
