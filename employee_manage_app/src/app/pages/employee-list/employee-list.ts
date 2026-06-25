import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss']
})
export class EmployeeList implements OnInit {
  employees: EmployeeModel[] = [];
  editingEmployee: EmployeeModel | null = null;

  private apiUrl = 'https://localhost:7043/api/EmployeeMaster';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.http.get<EmployeeModel[]>(`${this.apiUrl}`)
      .subscribe(data => this.employees = data);
  }

  editEmployee(emp: EmployeeModel) {
    this.editingEmployee = { ...emp };
  }

  updateEmployee() {
    if (!this.editingEmployee) return;
    this.editingEmployee.modifiedDate = new Date().toISOString();

    this.http.put<EmployeeModel>(
      `${this.apiUrl}/${this.editingEmployee.employeeId}`,
      this.editingEmployee
    ).subscribe(updated => {
      const idx = this.employees.findIndex(e => e.employeeId === updated.employeeId);
      if (idx > -1) this.employees[idx] = updated;
      this.editingEmployee = null;
    });
  }

  deleteEmployee(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe(() => this.employees = this.employees.filter(e => e.employeeId !== id));
  }
}
