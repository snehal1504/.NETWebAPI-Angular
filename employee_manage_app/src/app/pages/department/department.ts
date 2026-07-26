import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, DepartmentModel } from '../../services/api.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department.html',
  styleUrls: ['./department.scss']
})
export class Department implements OnInit {
  departments: DepartmentModel[] = [];
  newDept: DepartmentModel = { departmentId: 0, departmentName: '', isActive: true };
  editingDept: DepartmentModel | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.loadDepartments();
  }

  loadDepartments() {
    this.apiService.getDepartments().subscribe(data => this.departments = data);
  }

  addDepartment() {
    this.apiService.createDepartment(this.newDept).subscribe(() => {
      this.loadDepartments();
      this.newDept = { departmentId: 0, departmentName: '', isActive: true };
    });
  }

  editDepartment(dept: DepartmentModel) {
    this.editingDept = { ...dept };
  }

  updateDepartment() {
    if (!this.editingDept) return;
    this.apiService.updateDepartment(this.editingDept.departmentId, this.editingDept)
      .subscribe(() => {
        this.loadDepartments();
        this.editingDept = null;
      });
  }

  deleteDepartment(id: number) {
    this.apiService.deleteDepartment(id).subscribe(() => this.loadDepartments());
  }
}
