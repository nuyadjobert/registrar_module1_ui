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
import { SubjectService } from '../../../core/services/subject';

@Component({
  selector: 'app-subject-dialog',
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
      <mat-icon>book</mat-icon>
      <h2>{{ data.isEdit ? 'Edit Subject' : 'Add Subject' }}</h2>
    </div>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Subject Code</mat-label>
        <mat-icon matPrefix>tag</mat-icon>
        <input matInput [(ngModel)]="form.subject_code" placeholder="e.g. CS101" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Subject Name</mat-label>
        <mat-icon matPrefix>title</mat-icon>
        <input matInput [(ngModel)]="form.subject_name" placeholder="e.g. Introduction to Computing" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Units</mat-label>
        <mat-icon matPrefix>numbers</mat-icon>
        <input matInput type="number" [(ngModel)]="form.units" placeholder="e.g. 3" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Subject Type</mat-label>
        <mat-icon matPrefix>category</mat-icon>
        <mat-select [(ngModel)]="form.type">
          <mat-option value="Lecture">Lecture</mat-option>
          <mat-option value="Laboratory">Laboratory</mat-option>
          <mat-option value="Lecture & Lab">Lecture & Lab</mat-option>
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
export class SubjectDialog {
  form: any = {
    subject_code: '',
    subject_name: '',
    units: 0,
    type: 'Lecture',
    status: 'Active',
  };

  constructor(
    public dialogRef: MatDialogRef<SubjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.subject) {
      this.form = { ...data.subject };
    }
  }

  submit() {
    this.dialogRef.close(this.form);
  }
}

@Component({
  selector: 'app-subject-list',
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
  templateUrl: './subject-list.html',
  styleUrl: './subject-list.scss'
})
export class SubjectList implements OnInit {
  displayedColumns = ['subject_code', 'subject_name', 'units', 'type', 'status', 'actions'];
  subjects: any[] = [];
  filteredSubjects: any[] = [];
  loading = false;
  errorMessage = '';
  searchText = '';
  showSearch = false;

  constructor(
    private subjectService: SubjectService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadSubjects();
  }

  async loadSubjects() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.subjects = await this.subjectService.getAll();
      this.filteredSubjects = this.subjects;
    } catch (error: any) {
      this.errorMessage = 'Failed to load subjects.';
    } finally {
      this.loading = false;
    }
  }

  search() {
    const text = this.searchText.toLowerCase();
    this.filteredSubjects = this.subjects.filter(s =>
      s.subject_code?.toLowerCase().includes(text) ||
      s.subject_name?.toLowerCase().includes(text) ||
      s.type?.toLowerCase().includes(text) ||
      s.status?.toLowerCase().includes(text)
    );
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchText = '';
      this.filteredSubjects = this.subjects;
    }
  }

  getStatusColor(status: string) {
    return status === 'Active' ? 'primary' : 'warn';
  }

  getTypeColor(type: string) {
    switch(type) {
      case 'Lecture': return 'primary';
      case 'Laboratory': return 'accent';
      case 'Lecture & Lab': return undefined;
      default: return undefined;
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(SubjectDialog, {
      data: { isEdit: false },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.subjectService.create(result);
          await this.loadSubjects();
        } catch (error) {
          this.errorMessage = 'Failed to create subject.';
        }
      }
    });
  }

  openEditDialog(subject: any) {
    const dialogRef = this.dialog.open(SubjectDialog, {
      data: { isEdit: true, subject },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.subjectService.update(subject.id, result);
          await this.loadSubjects();
        } catch (error) {
          this.errorMessage = 'Failed to update subject.';
        }
      }
    });
  }

  async deleteSubject(id: number) {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await this.subjectService.delete(id);
        await this.loadSubjects();
      } catch (error) {
        this.errorMessage = 'Failed to delete subject.';
      }
    }
  }
}