import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  data: {
    employeeId: number;
    role: string;
    email: string;
    firstName: string;
    contactNo: string;
    designationId: number;
  };
}

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

export interface EmployeeCreateRequest {
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
  role?: string;
  password: string;
}

export interface EmployeeUpdateRequest {
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
  modifiedDate: string;
  role?: string;
}

export interface DepartmentModel {
  departmentId: number;
  departmentName: string;
  isActive: boolean;
}

export interface DesignationModel {
  designationId: number;
  designationName: string;
  departmentId: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiBase = API_BASE_URL;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiBase}/EmployeeMaster/login`, credentials);
  }

  getEmployees() {
    return this.http.get<EmployeeModel[]>(`${this.apiBase}/EmployeeMaster`);
  }

  createEmployee(employee: EmployeeCreateRequest) {
    return this.http.post<EmployeeModel>(`${this.apiBase}/EmployeeMaster`, employee);
  }

  updateEmployee(id: number, employee: EmployeeUpdateRequest) {
    return this.http.put<EmployeeModel>(`${this.apiBase}/EmployeeMaster/${id}`, employee);
  }

  deleteEmployee(id: number) {
    return this.http.delete<void>(`${this.apiBase}/EmployeeMaster/${id}`);
  }

  getDepartments() {
    return this.http.get<DepartmentModel[]>(`${this.apiBase}/DepartmentMaster`);
  }

  createDepartment(department: DepartmentModel) {
    return this.http.post<DepartmentModel>(`${this.apiBase}/DepartmentMaster`, department);
  }

  updateDepartment(id: number, department: DepartmentModel) {
    return this.http.put<DepartmentModel>(`${this.apiBase}/DepartmentMaster/${id}`, department);
  }

  deleteDepartment(id: number) {
    return this.http.delete<void>(`${this.apiBase}/DepartmentMaster/${id}`);
  }

  getDesignations() {
    return this.http.get<DesignationModel[]>(`${this.apiBase}/DesignationMaster`);
  }

  createDesignation(designation: DesignationModel) {
    return this.http.post<DesignationModel>(`${this.apiBase}/DesignationMaster`, designation);
  }

  updateDesignation(id: number, designation: DesignationModel) {
    return this.http.put<DesignationModel>(`${this.apiBase}/DesignationMaster/${id}`, designation);
  }

  deleteDesignation(id: number) {
    return this.http.delete<void>(`${this.apiBase}/DesignationMaster/${id}`);
  }

  getDesignationsByDepartment(departmentId: number) {
    return this.http.get<DesignationModel[]>(`${this.apiBase}/DesignationMaster/filter/${departmentId}`);
  }
}
