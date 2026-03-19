import { Component, OnInit, Inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { SectionService } from '../../../core/services/section';
import { SubjectService } from '../../../core/services/subject';

@Component({
  selector: 'app-section-dialog',
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
      <mat-icon>class</mat-icon>
      <h2>{{ data.isEdit ? 'Edit Section' : 'Add Section' }}</h2>
    </div>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Section Name</mat-label>
        <mat-icon matPrefix>tag</mat-icon>
        <input matInput [(ngModel)]="form.section_name" placeholder="e.g. BSCS-1A" />
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
        <mat-label>Capacity</mat-label>
        <mat-icon matPrefix>people</mat-icon>
        <input matInput type="number" [(ngModel)]="form.capacity" placeholder="e.g. 40" />
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
        <mat-label>Semester</mat-label>
        <mat-icon matPrefix>event</mat-icon>
        <mat-select [(ngModel)]="form.semester">
          <mat-option value="1st Semester">1st Semester</mat-option>
          <mat-option value="2nd Semester">2nd Semester</mat-option>
          <mat-option value="Summer">Summer</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Status</mat-label>
        <mat-icon matPrefix>info</mat-icon>
        <mat-select [(ngModel)]="form.status">
          <mat-option value="Open">Open</mat-option>
          <mat-option value="Closed">Closed</mat-option>
          <mat-option value="Full">Full</mat-option>
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
        max-height: 60vh;
        overflow-y: auto;
      }
      mat-dialog-actions {
        padding: 12px 24px 20px !important;
        border-top: 1px solid #e0e0e0;
      }
    </style>
  `
})
export class SectionDialog {
  form: any = {
    section_name: '',
    subject_id: null,
    capacity: null,
    school_year: '2025-2026',
    semester: '1st Semester',
    status: 'Open',
  };

  constructor(
    public dialogRef: MatDialogRef<SectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.section) {
      this.form = { ...data.section };
    }
  }

  submit() {
    this.dialogRef.close(this.form);
  }
}

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './section-list.html',
  styleUrl: './section-list.scss'
})
export class SectionList implements OnInit {
  displayedColumns = ['section_name', 'subject_name', 'school_year', 'semester', 'capacity', 'status', 'actions'];
  sections: any[] = [];
  filteredSections: any[] = [];
  subjects: any[] = [];
  loading = false;
  errorMessage = '';
  searchText = '';
  showSearch = false;

  constructor(
    private sectionService: SectionService,
    private subjectService: SubjectService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadSections();
    await this.loadSubjects();
  }

  async loadSections() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.sections = await this.sectionService.getAll();
      this.filteredSections = this.sections;
    } catch (error: any) {
      this.errorMessage = 'Failed to load sections.';
    } finally {
      this.loading = false;
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
    this.filteredSections = this.sections.filter(s =>
      s.section_name?.toLowerCase().includes(text) ||
      s.subject?.subject_name?.toLowerCase().includes(text) ||
      s.school_year?.toLowerCase().includes(text) ||
      s.semester?.toLowerCase().includes(text) ||
      s.status?.toLowerCase().includes(text)
    );
  }

toggleSearch() {
  this.showSearch = !this.showSearch;
  if (!this.showSearch) {
    this.searchText = '';
    this.filteredSections = this.sections;
  }
}
  getStatusColor(status: string) {
    switch(status) {
      case 'Open': return 'primary';
      case 'Full': return 'warn';
      case 'Closed': return 'accent';
      default: return 'primary';
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(SectionDialog, {
      data: { isEdit: false, subjects: this.subjects },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.sectionService.create(result);
          await this.loadSections();
        } catch (error) {
          this.errorMessage = 'Failed to create section.';
        }
      }
    });
  }

  openEditDialog(section: any) {
    const dialogRef = this.dialog.open(SectionDialog, {
      data: { isEdit: true, section, subjects: this.subjects },
      panelClass: 'custom-dialog'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.sectionService.update(section.id, result);
          await this.loadSections();
        } catch (error) {
          this.errorMessage = 'Failed to update section.';
        }
      }
    });
  }

  async deleteSection(id: number) {
    if (confirm('Are you sure you want to delete this section?')) {
      try {
        await this.sectionService.delete(id);
        await this.loadSections();
      } catch (error) {
        this.errorMessage = 'Failed to delete section.';
      }
    }
  }
}