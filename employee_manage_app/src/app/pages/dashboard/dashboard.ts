import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  firstName: string = '';

  ngOnInit(): void {
    // Retrieve logged-in user info from localStorage
    const userData = localStorage.getItem('empLoginUser');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.firstName = parsed.firstName || '';
    }
  }
}
