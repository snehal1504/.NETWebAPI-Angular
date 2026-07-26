import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, DesignationModel } from '../../services/api.service';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './designation.html',
  styleUrls: ['./designation.scss']
})
export class Designation implements OnInit {
  designations: DesignationModel[] = [];
  newDesignation: DesignationModel = { designationId: 0, designationName: '', departmentId: 0 };
  editingDesignation: DesignationModel | null = null;
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

  addDesignation() {
    this.apiService.createDesignation(this.newDesignation).subscribe(() => {
      this.loadDesignations();
      this.newDesignation = { designationId: 0, designationName: '', departmentId: 0 };
    });
  }

  editDesignation(designation: DesignationModel) {
    this.editingDesignation = { ...designation };
  }

  updateDesignation() {
    if (!this.editingDesignation) return;
    this.apiService.updateDesignation(this.editingDesignation.designationId, this.editingDesignation)
      .subscribe(() => {
        this.loadDesignations();
        this.editingDesignation = null;
      });
  }

  deleteDesignation(id: number) {
    this.apiService.deleteDesignation(id).subscribe(() => this.loadDesignations());
  }

  filterByDepartment(deptId: number) {
    this.apiService.getDesignationsByDepartment(deptId)
      .subscribe(data => this.designations = data);
  }
}
