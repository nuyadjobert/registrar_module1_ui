import { Component, OnInit, Inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course';

@Component({
  selector: 'app-course-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="dialog-header">
      <mat-icon>menu_book</mat-icon>
      <h2>{{ data.isEdit ? 'Edit Course' : 'Add Course' }}</h2>
    </div>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Course Code</mat-label>
        <mat-icon matPrefix>tag</mat-icon>
        <input matInput [(ngModel)]="form.course_code" placeholder="e.g. BSCS" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Course Name</mat-label>
        <mat-icon matPrefix>title</mat-icon>
        <input matInput [(ngModel)]="form.course_name" placeholder="e.g. BS Computer Science" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Units</mat-label>
        <mat-icon matPrefix>numbers</mat-icon>
        <input matInput type="number" [(ngModel)]="form.units" placeholder="e.g. 3" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Department</mat-label>
        <mat-icon matPrefix>business</mat-icon>
        <input matInput [(ngModel)]="form.department" placeholder="e.g. BSCS" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Course Type</mat-label>
        <mat-icon matPrefix>category</mat-icon>
        <mat-select [(ngModel)]="form.type">
          <mat-option value="Major">Major</mat-option>
          <mat-option value="Minor">Minor</mat-option>
          <mat-option value="Elective">Elective</mat-option>
          <mat-option value="General Education">General Education</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Status</mat-label>
        <mat-icon matPrefix>info</mat-icon>
        <mat-select [(ngModel)]="form.status">
          <mat-option value="Active">Active</mat-option>
          <mat-option value="Inactive">Inactive</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Description</mat-label>
        <mat-icon matPrefix>description</mat-icon>
        <textarea matInput [(ngModel)]="form.description"
                  placeholder="Brief description of the course..."
                  rows="3"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>
        <mat-icon>close</mat-icon> Cancel
      </button>
      <button mat-raised-button color="primary" (click)="submit()">
        <mat-icon>{{ data.isEdit ? 'save' : 'add' }}</mat-icon>
        {{ data.isEdit ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
    <style>
      .dialog-header {
        background: #1a3a5c;
        color: white;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 12px 12px 0 0;
      }
      .dialog-header h2 { margin: 0; font-size: 18px; font-weight: 600; }
      .dialog-header mat-icon { font-size: 22px; width: 22px; height: 22px; }
      .full-width { width: 100%; margin-bottom: 8px; }
      mat-dialog-content {
        display: flex;
        flex-direction: column;
        min-width: 440px;
        padding: 24px 24px 8px !important;
        max-height: 65vh;
        overflow-y: auto;
      }
      mat-dialog-actions {
        padding: 12px 24px 20px !important;
        border-top: 1px solid #e0e0e0;
      }
    </style>
  `
})
export class CourseDialog {
  form: any = {
    course_code: '',
    course_name: '',
    units: 0,
    department: '',
    status: 'Active',
    type: 'Major',
    description: '',
  };

  constructor(
    public dialogRef: MatDialogRef<CourseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.course) {
      this.form = { ...data.course };
    }
  }

  submit() {
    this.dialogRef.close(this.form);
  }
}

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss'
})
export class CourseList implements OnInit {
  displayedColumns = ['course_code', 'course_name', 'units', 'department', 'type', 'status', 'actions'];
  courses: any[] = [];
  filteredCourses: any[] = [];
  loading = false;
  errorMessage = '';
  searchText = '';
  showSearch = false;

  constructor(
    private courseService: CourseService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadCourses();
  }

  async loadCourses() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.courses = await this.courseService.getAll();
      this.filteredCourses = this.courses;
    } catch (error: any) {
      this.errorMessage = 'Failed to load courses.';
    } finally {
      this.loading = false;
    }
  }

  search() {
    const text = this.searchText.toLowerCase();
    this.filteredCourses = this.courses.filter(c =>
      c.course_code?.toLowerCase().includes(text) ||
      c.course_name?.toLowerCase().includes(text) ||
      c.department?.toLowerCase().includes(text) ||
      c.type?.toLowerCase().includes(text) ||
      c.status?.toLowerCase().includes(text)
    );
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchText = '';
      this.filteredCourses = this.courses;
    }
  }

  getStatusColor(status: string) {
    return status === 'Active' ? 'primary' : 'warn';
  }

  getTypeColor(type: string) {
    switch(type) {
      case 'Major': return 'primary';
      case 'Minor': return 'accent';
      case 'Elective': return 'warn';
      default: return undefined;
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CourseDialog, {
      data: { isEdit: false },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.courseService.create(result);
          await this.loadCourses();
        } catch (error) {
          this.errorMessage = 'Failed to create course.';
        }
      }
    });
  }

  openEditDialog(course: any) {
    const dialogRef = this.dialog.open(CourseDialog, {
      data: { isEdit: true, course },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.courseService.update(course.id, result);
          await this.loadCourses();
        } catch (error) {
          this.errorMessage = 'Failed to update course.';
        }
      }
    });
  }

  async deleteCourse(id: number) {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await this.courseService.delete(id);
        await this.loadCourses();
      } catch (error) {
        this.errorMessage = 'Failed to delete course.';
      }
    }
  }
}