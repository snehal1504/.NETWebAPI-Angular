import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Settings], // standalone component import
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default settings', () => {
    expect(component.userSettings.theme).toBe('light');
    expect(component.userSettings.notifications).toBe(true);
    expect(component.userSettings.language).toBe('en');
  });

  it('should update settings on save', () => {
    component.userSettings.theme = 'dark';
    component.saveSettings();
    expect(component.userSettings.theme).toBe('dark');
  });
});
