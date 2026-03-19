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
import { CurriculumService } from '../../../core/services/curriculum';
import { CourseService } from '../../../core/services/course';
import { SubjectService } from '../../../core/services/subject';

@Component({
  selector: 'app-curriculum-dialog',
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
      <mat-icon>library_books</mat-icon>
      <h2>{{ data.isEdit ? 'Edit Curriculum' : 'Add Curriculum' }}</h2>
    </div>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Course</mat-label>
        <mat-icon matPrefix>menu_book</mat-icon>
        <mat-select [(ngModel)]="form.course_id">
          @for (course of data.courses; track course.id) {
            <mat-option [value]="course.id">
              {{ course.course_code }} - {{ course.course_name }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Subject</mat-label>
        <mat-icon matPrefix>book</mat-icon>
        <mat-select [(ngModel)]="form.subject_id">
          @for (subject of data.subjects; track subject.id) {
            <mat-option [value]="subject.id">
              {{ subject.subject_code }} - {{ subject.subject_name }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Year Level</mat-label>
        <mat-icon matPrefix>school</mat-icon>
        <mat-select [(ngModel)]="form.year_level">
          <mat-option [value]="1">1st Year</mat-option>
          <mat-option [value]="2">2nd Year</mat-option>
          <mat-option [value]="3">3rd Year</mat-option>
          <mat-option [value]="4">4th Year</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Semester</mat-label>
        <mat-icon matPrefix>event</mat-icon>
        <mat-select [(ngModel)]="form.semester">
          <mat-option [value]="1">1st Semester</mat-option>
          <mat-option [value]="2">2nd Semester</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>School Year</mat-label>
        <mat-icon matPrefix>calendar_today</mat-icon>
        <mat-select [(ngModel)]="form.school_year">
          <mat-option value="2024-2025">2024-2025</mat-option>
          <mat-option value="2025-2026">2025-2026</mat-option>
          <mat-option value="2026-2027">2026-2027</mat-option>
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
export class CurriculumDialog {
  form: any = {
    course_id: null,
    subject_id: null,
    year_level: null,
    semester: null,
    school_year: '2025-2026',
    status: 'Active',
  };

  constructor(
    public dialogRef: MatDialogRef<CurriculumDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.curriculum) {
      this.form = { ...data.curriculum };
    }
  }

  submit() {
    this.dialogRef.close(this.form);
  }
}

@Component({
  selector: 'app-curriculum-list',
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
  templateUrl: './curriculum-list.html',
  styleUrl: './curriculum-list.scss'
})
export class CurriculumList implements OnInit {
  displayedColumns = ['course_name', 'subject_name', 'year_level', 'semester', 'school_year', 'status', 'actions'];
  curriculums: any[] = [];
  filteredCurriculums: any[] = [];
  courses: any[] = [];
  subjects: any[] = [];
  loading = false;
  errorMessage = '';
  searchText = '';
  showSearch = false;

  constructor(
    private curriculumService: CurriculumService,
    private courseService: CourseService,
    private subjectService: SubjectService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadCurriculums();
    await this.loadCourses();
    await this.loadSubjects();
  }

  async loadCurriculums() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.curriculums = await this.curriculumService.getAll();
      this.filteredCurriculums = this.curriculums;
    } catch (error: any) {
      this.errorMessage = 'Failed to load curriculum.';
    } finally {
      this.loading = false;
    }
  }

  async loadCourses() {
    try {
      this.courses = await this.courseService.getAll();
    } catch (error) {
      console.error('Failed to load courses');
    }
  }

  async loadSubjects() {
    try {
      this.subjects = await this.subjectService.getAll();
    } catch (error) {
      console.error('Failed to load subjects');
    }
  }

  search() {
    const text = this.searchText.toLowerCase();
    this.filteredCurriculums = this.curriculums.filter(c =>
      c.course?.course_name?.toLowerCase().includes(text) ||
      c.subject?.subject_name?.toLowerCase().includes(text) ||
      c.school_year?.toLowerCase().includes(text) ||
      c.status?.toLowerCase().includes(text)
    );
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchText = '';
      this.filteredCurriculums = this.curriculums;
    }
  }

  getStatusColor(status: string) {
    return status === 'Active' ? 'primary' : 'warn';
  }

  getSemesterLabel(semester: number) {
    return semester === 1 ? '1st Semester' : '2nd Semester';
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CurriculumDialog, {
      data: { isEdit: false, courses: this.courses, subjects: this.subjects },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.curriculumService.create(result);
          await this.loadCurriculums();
        } catch (error) {
          this.errorMessage = 'Failed to create curriculum.';
        }
      }
    });
  }

  openEditDialog(curriculum: any) {
    const dialogRef = this.dialog.open(CurriculumDialog, {
      data: { isEdit: true, curriculum, courses: this.courses, subjects: this.subjects },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.curriculumService.update(curriculum.id, result);
          await this.loadCurriculums();
        } catch (error) {
          this.errorMessage = 'Failed to update curriculum.';
        }
      }
    });
  }

  async deleteCurriculum(id: number) {
    if (confirm('Are you sure you want to delete this curriculum?')) {
      try {
        await this.curriculumService.delete(id);
        await this.loadCurriculums();
      } catch (error) {
        this.errorMessage = 'Failed to delete curriculum.';
      }
    }
  }
}