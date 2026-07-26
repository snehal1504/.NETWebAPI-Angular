import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService, EmployeeCreateRequest, DesignationModel } from '../../services/api.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.scss']
})
export class EmployeeForm implements OnInit {
  newEmployee: Partial<EmployeeCreateRequest> = {
    firstName: '',
    lastName: '',
    contactNo: '',
    state: '',
    city: '',
    pincode: '',
    altContactNo: '',
    address: '',
    email: '',
    designationId: 0,
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
    role: '',
    password: ''
  };
  designations: DesignationModel[] = [];
  private platformId = inject(PLATFORM_ID);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.loadDesignations();
  }

  loadDesignations() {
    this.apiService.getDesignations().subscribe(data => this.designations = data);
  }

  addEmployee(form: NgForm) {
    if (!form.valid || !this.newEmployee.password) return;

    const payload: EmployeeCreateRequest = {
      ...this.newEmployee,
      firstName: this.newEmployee.firstName || '',
      lastName: this.newEmployee.lastName || '',
      contactNo: this.newEmployee.contactNo || '',
      state: this.newEmployee.state || '',
      city: this.newEmployee.city || '',
      pincode: this.newEmployee.pincode || '',
      altContactNo: this.newEmployee.altContactNo,
      address: this.newEmployee.address || '',
      email: this.newEmployee.email || '',
      designationId: this.newEmployee.designationId,
      hireDate: this.newEmployee.hireDate || new Date().toISOString().split('T')[0],
      salary: this.newEmployee.salary || 0,
      role: this.newEmployee.role || '',
      password: this.newEmployee.password || ''
    };

    this.apiService.createEmployee(payload).subscribe(() => {
      alert('Employee created successfully');
      this.newEmployee = { ...payload, firstName: '', lastName: '', contactNo: '', state: '', city: '', pincode: '', address: '', email: '', role: '', password: '' };
      form.resetForm();
    });
  }
}
