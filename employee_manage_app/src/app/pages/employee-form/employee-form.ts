import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

export interface EmployeeModel {
  employeeId: number;
  firstName: string;
  lastName: string;
  contactNo: string;
  state: string;
  city: string;
  pincode: string;
  altContactNo?: string;
  address: string;
  email: string;
  designationId?: number;
  hireDate: string;
  salary: number;
  createdDate: string;
  modifiedDate: string;
  role?: string;
  password?: string;
}

export interface DesignationModel {
  designationId: number;
  designationName: string;
  departmentId: number;
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.scss']
})
export class EmployeeForm implements OnInit {
  newEmployee: Partial<EmployeeModel> = {};
  plainPassword: string = '';
  designations: DesignationModel[] = [];

  private apiUrl = 'https://localhost:7043/api/EmployeeMaster';
  private designationApi = 'https://localhost:7043/api/DesignationMaster';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  loadDesignations() {
    this.http.get<DesignationModel[]>(`${this.designationApi}`)
      .subscribe(data => this.designations = data);
  }

  addEmployee(form: NgForm) {
    if (!form.valid) return;

    this.newEmployee.createdDate = new Date().toISOString();
    this.newEmployee.modifiedDate = new Date().toISOString();

    this.http.post<EmployeeModel>(
      `${this.apiUrl}/create?plainPassword=${encodeURIComponent(this.plainPassword)}`,
      this.newEmployee
    ).subscribe(() => {
      alert('Employee created successfully');
      this.newEmployee = {};
      this.plainPassword = '';
      form.resetForm();
    });
  }
}
