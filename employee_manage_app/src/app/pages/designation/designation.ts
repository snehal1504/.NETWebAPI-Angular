import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface DesignationModel {
  designationId: number;
  designationName: string;
  departmentId: number;
}

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './designation.html',
  styleUrls: ['./designation.scss']
})
export class Designation implements OnInit {
  designations: DesignationModel[] = [];
  newDesignation: DesignationModel = { designationId: 0, designationName: '', departmentId: 0 };
  editingDesignation: DesignationModel | null = null;

  private apiUrl = 'https://localhost:7043/api/DesignationMaster';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  // ✅ Load all designations
  loadDesignations() {
    this.http.get<DesignationModel[]>(`${this.apiUrl}`)
      .subscribe(data => this.designations = data);
  }

  // ✅ Add new designation
  addDesignation() {
    this.http.post<DesignationModel>(`${this.apiUrl}`, this.newDesignation)
      .subscribe(() => {
        this.loadDesignations(); // reload fresh list
        this.newDesignation = { designationId: 0, designationName: '', departmentId: 0 };
      });
  }

  // ✅ Start editing
  editDesignation(designation: DesignationModel) {
    this.editingDesignation = { ...designation };
  }

  // ✅ Update designation
  updateDesignation() {
    if (!this.editingDesignation) return;
    this.http.put<DesignationModel>(
      `${this.apiUrl}/${this.editingDesignation.designationId}`,
      this.editingDesignation
    ).subscribe(() => {
      this.loadDesignations(); // reload fresh list
      this.editingDesignation = null;
    });
  }

  // ✅ Delete designation
  deleteDesignation(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe(() => this.loadDesignations());
  }

  // ✅ Filter by department
  filterByDepartment(deptId: number) {
    this.http.get<DesignationModel[]>(`${this.apiUrl}/filter/${deptId}`)
      .subscribe(data => this.designations = data);
  }
}
