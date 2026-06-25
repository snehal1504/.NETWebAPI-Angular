import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface DepartmentModel {
  departmentId: number;
  departmentName: string;
  isActive: boolean;
}

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './department.html',
  styleUrls: ['./department.scss']
})
export class Department implements OnInit {
  departments: DepartmentModel[] = [];
  newDept: DepartmentModel = { departmentId: 0, departmentName: '', isActive: true };
  editingDept: DepartmentModel | null = null;

  private apiUrl = 'https://localhost:7043/api/DepartmentMaster';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  // ✅ Load all departments
  loadDepartments() {
    this.http.get<DepartmentModel[]>(`${this.apiUrl}/GetAllDepartments`)
      .subscribe(data => this.departments = data);
  }

  // ✅ Add new department
  addDepartment() {
    this.http.post<DepartmentModel>(`${this.apiUrl}/CreateDepartment`, this.newDept)
      .subscribe(() => {
        this.loadDepartments(); // reload fresh list
        this.newDept = { departmentId: 0, departmentName: '', isActive: true };
      });
  }

  // ✅ Start editing
  editDepartment(dept: DepartmentModel) {
    this.editingDept = { ...dept };
  }

  // ✅ Update department
  updateDepartment() {
    if (!this.editingDept) return;
    this.http.put<DepartmentModel>(
      `${this.apiUrl}/UpdateDepartment/${this.editingDept.departmentId}`,
      this.editingDept
    ).subscribe(() => {
      this.loadDepartments(); // reload fresh list
      this.editingDept = null;
    });
  }

  // ✅ Delete department
  deleteDepartment(id: number) {
    this.http.delete(`${this.apiUrl}/DeleteDepartment/${id}`)
      .subscribe(() => this.loadDepartments());
  }
}
