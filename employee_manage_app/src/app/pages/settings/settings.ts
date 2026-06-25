import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings {
  // Example settings model
  userSettings = {
    theme: 'light',
    notifications: true,
    language: 'en'
  };

  saveSettings() {
    alert('Settings saved successfully!');
    console.log('Saved settings:', this.userSettings);
  }
}
