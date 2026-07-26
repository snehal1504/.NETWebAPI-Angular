import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterModule } from '@angular/router';

type NavItem = { label: string; path: string; icon: string; badge?: string | number };

@Component({
  selector: 'app-header',
  imports: [FormsModule, RouterOutlet, RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  private platformId = inject(PLATFORM_ID);
  collapsed = signal(this.getInitialCollapsedState());
  mobileVisible = false;

  toggle() {
    const next = !this.collapsed();
    this.collapsed.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidebarCollapsed', String(next));
    }
  }

  showMobile() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.mobileVisible = true;
    const el = document.querySelector('.app-sidebar');
    el?.classList.add('show-mobile');
  }

  hideMobile() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.mobileVisible = false;
    const el = document.querySelector('.app-sidebar');
    el?.classList.remove('show-mobile');
  }

  onNavClickMobile() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (window.innerWidth <= 767.98) {
      this.hideMobile();
    }
  }

  private getInitialCollapsedState(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return localStorage.getItem('sidebarCollapsed') === 'true';
  }

  // Navigation items (adjust labels/paths/icons to match your routes)
  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'fa-solid fa-chart-line' },
    { label: 'Employees', path: '/employees', icon: 'fa-solid fa-users' },
    { label: 'New Employee', path: '/new-employee', icon: 'fa-solid fa-user-plus' },
    { label: 'Department', path: '/department', icon: 'fa-solid fa-building' },
    { label: 'Designation', path: '/designation', icon: 'fa-solid fa-briefcase' },
    { label: 'Settings', path: '/settings', icon: 'fa-solid fa-gear' }
  ];
}
