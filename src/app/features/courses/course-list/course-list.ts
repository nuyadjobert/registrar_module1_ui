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
        background: #0d2137;
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
        min-width: 420px;
        padding: 24px 24px 8px !important;
      }
      mat-dialog-actions {
        padding: 12px 24px 20px !important;
        border-top: 1px solid #e0e0e0;
      }
    </style>
  `
})
export class CourseDialog {
  form = {
    course_code: '',
    course_name: '',
    units: 0,
    department: '',
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
  ],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss'
})
export class CourseList implements OnInit {
  displayedColumns = ['course_code', 'course_name', 'units', 'department', 'actions'];
  courses: any[] = [];
  loading = false;
  errorMessage = '';

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
    } catch (error: any) {
      this.errorMessage = 'Failed to load courses. Please try again.';
    } finally {
      this.loading = false;
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