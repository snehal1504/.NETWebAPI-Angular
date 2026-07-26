import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private authState = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authState.asObservable();

  constructor() {
    if (this.isBrowser()) {
      this.authState.next(this.hasToken());
    }
  }

  login(token: string, userData: unknown) {
    if (this.isBrowser()) {
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('empLoginUser', JSON.stringify(userData));
      this.authState.next(true);
    }
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('empLoginUser');
    }

    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('jwtToken') : null;
  }

  getUser() {
    if (!this.isBrowser()) return null;
    const payload = localStorage.getItem('empLoginUser');
    return payload ? JSON.parse(payload) : null;
  }

  isLoggedIn(): boolean {
    return this.isBrowser() && this.hasToken();
  }

  private hasToken(): boolean {
    return this.isBrowser() && !!localStorage.getItem('jwtToken');
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
