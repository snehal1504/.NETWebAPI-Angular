import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  loginObj = {
    email: '',
    password: ''
  };

  private router = inject(Router);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  onLogin() {
    this.apiService.login(this.loginObj).subscribe({
      next: (result) => {
        this.authService.login(result.token, result.data);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert(err.error?.message || 'Login failed');
      }
    });
  }
}

