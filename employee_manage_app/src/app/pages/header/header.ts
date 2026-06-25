import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  collapsed = signal(localStorage.getItem('sidebarCollapsed') === 'true');
  mobileVisible = false;

  // Navigation items (adjust labels/paths/icons to match your routes)
  navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'fa-solid fa-chart-line' },
    { label: 'Employees', path: '/employees', icon: 'fa-solid fa-users' },
    { label: 'New Employee', path: '/new-employee', icon: 'fa-solid fa-user-plus' },
    { label: 'Department', path: '/department', icon: 'fa-solid fa-building' },
    { label: 'Designation', path: '/designation', icon: 'fa-solid fa-briefcase' },
    { label: 'Settings', path: '/settings', icon: 'fa-solid fa-gear' }
  ];

  toggle() {
    const next = !this.collapsed();
    this.collapsed.set(next);
    localStorage.setItem('sidebarCollapsed', String(next));
  }

  showMobile() {
    this.mobileVisible = true;
    const el = document.querySelector('.app-sidebar');
    el?.classList.add('show-mobile');
  }

  hideMobile() {
    this.mobileVisible = false;
    const el = document.querySelector('.app-sidebar');
    el?.classList.remove('show-mobile');
  }

  // Close mobile overlay after navigation
  onNavClickMobile() {
    if (window.innerWidth <= 767.98) {
      this.hideMobile();
    }
  }
}
