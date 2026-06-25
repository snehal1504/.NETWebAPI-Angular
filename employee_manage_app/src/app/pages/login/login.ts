import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  HttpHandlerFn,  } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,              // ✅ Use standalone component in Angular 14+
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],   // ✅ Corrected property name (styleUrls instead of styleUrl)
})
export class Login {
  loginObj: any = {
    Email: '',
    Password: ''                 // ✅ Use Password instead of ContactNo for login
  };

  router = inject(Router);
  http = inject(HttpClient);

  onLogin() {
    this.http.post('https://localhost:7043/api/EmployeeMaster/login', this.loginObj)
      .subscribe({
        next: (result: any) => {
          if (result.token) {
            debugger;
            localStorage.setItem('jwtToken', result.token);
            console.log('Login successful, token stored:', result.token);
            console.log('router', this.router);
            debugger;
            localStorage.setItem('empLoginUser', JSON.stringify(result.data));
            debugger;
            const tree = this.router.createUrlTree(['dashboard']);
            this.router.navigateByUrl(tree);
          } else {
            debugger;
            console.error('No token returned from API');
          }
        },
        error: (err) => {
          debugger;
          alert(err.error.message || 'Login failed');
        }
      });
  }
}

export function jwtInterceptorFn(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('jwtToken');
  const modifiedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(modifiedReq);
}

