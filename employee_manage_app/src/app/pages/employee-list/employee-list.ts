import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, EmployeeModel } from '../../services/api.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss']
})
export class EmployeeList implements OnInit {
  employees: EmployeeModel[] = [];
  editingEmployee: EmployeeModel | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.loadEmployees();
  }

  loadEmployees() {
    this.apiService.getEmployees().subscribe(data => this.employees = data);
  }

  editEmployee(emp: EmployeeModel) {
    this.editingEmployee = { ...emp };
  }

  updateEmployee() {
    if (!this.editingEmployee) return;
    this.editingEmployee.modifiedDate = new Date().toISOString();

    this.apiService.updateEmployee(this.editingEmployee.employeeId, this.editingEmployee)
      .subscribe(updated => {
        const idx = this.employees.findIndex(e => e.employeeId === updated.employeeId);
        if (idx > -1) this.employees[idx] = updated;
        this.editingEmployee = null;
      });
  }

  deleteEmployee(id: number) {
    this.apiService.deleteEmployee(id).subscribe(() => {
      this.employees = this.employees.filter(e => e.employeeId !== id);
    });
  }
}
