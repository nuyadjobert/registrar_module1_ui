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

// ─────────────────────────────────────────────────────────────────────────────
// CurriculumDialog
// ─────────────────────────────────────────────────────────────────────────────
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
    <!-- ── Header ── -->
    <div class="dlg-head">
      <div class="dlg-head-icon">
        <mat-icon>library_books</mat-icon>
      </div>
      <div class="dlg-head-text">
        <h2>{{ data.isEdit ? 'Edit Curriculum' : 'Add Curriculum' }}</h2>
        <p>{{ data.isEdit ? 'ACADEMIC REGISTRY · UPDATE ENTRY' : 'ACADEMIC REGISTRY · NEW ENTRY' }}</p>
      </div>
      <button class="dlg-close" mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <!-- ── Body ── -->
    <mat-dialog-content class="dlg-body">

      <!-- Course -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Course
          <span class="dlg-req">*</span>
        </label>
        <div class="dlg-select-wrap">
          <mat-icon class="dlg-input-icon">menu_book</mat-icon>
          <select class="dlg-select" [(ngModel)]="form.course_id">
            <option [ngValue]="null" disabled>Select a course...</option>
            @for (course of data.courses; track course.id) {
              <option [ngValue]="course.id">
                {{ course.course_code }} — {{ course.course_name }}
              </option>
            }
          </select>
          <mat-icon class="dlg-select-arrow">expand_more</mat-icon>
        </div>
      </div>

      <!-- Subject -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Subject
          <span class="dlg-req">*</span>
        </label>
        <div class="dlg-select-wrap">
          <mat-icon class="dlg-input-icon">book</mat-icon>
          <select class="dlg-select" [(ngModel)]="form.subject_id">
            <option [ngValue]="null" disabled>Select a subject...</option>
            @for (subject of data.subjects; track subject.id) {
              <option [ngValue]="subject.id">
                {{ subject.subject_code }} — {{ subject.subject_name }}
              </option>
            }
          </select>
          <mat-icon class="dlg-select-arrow">expand_more</mat-icon>
        </div>
      </div>

      <!-- Row: Year Level + Semester -->
      <div class="dlg-row">
        <div class="dlg-field">
          <label class="dlg-label">
            <span class="dlg-dot"></span>Year Level
            <span class="dlg-req">*</span>
          </label>
          <div class="dlg-year-grid">
            @for (y of yearLevels; track y.value) {
              <div
                class="dlg-year-card"
                [class.selected]="form.year_level === y.value"
                (click)="form.year_level = y.value"
              >
                <span class="year-num">{{ y.value }}</span>
                <span class="year-label">{{ y.label }}</span>
              </div>
            }
          </div>
        </div>

        <div class="dlg-field">
          <label class="dlg-label">
            <span class="dlg-dot"></span>Semester
            <span class="dlg-req">*</span>
          </label>
          <div class="dlg-sem-col">
            @for (s of semesters; track s.value) {
              <div
                class="dlg-sem-pill"
                [class.selected]="form.semester === s.value"
                (click)="form.semester = s.value"
              >
                <mat-icon class="sem-icon">{{ s.icon }}</mat-icon>
                {{ s.label }}
              </div>
            }
          </div>
        </div>
      </div>

      <!-- School Year -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>School Year
          <span class="dlg-req">*</span>
        </label>
        <div class="dlg-sy-row">
          @for (sy of schoolYears; track sy) {
            <div
              class="dlg-sy-pill"
              [class.selected]="form.school_year === sy"
              (click)="form.school_year = sy"
            >
              <mat-icon class="sy-icon">calendar_today</mat-icon>
              {{ sy }}
            </div>
          }
        </div>
      </div>

      <!-- Status -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Status
        </label>
        <div class="dlg-status-row">
          <div
            class="dlg-status-pill"
            [class.active]="form.status === 'Active'"
            (click)="form.status = 'Active'"
          >
            <span class="pill-dot"></span> Active
          </div>
          <div
            class="dlg-status-pill dlg-status-inactive"
            [class.active]="form.status === 'Inactive'"
            (click)="form.status = 'Inactive'"
          >
            <span class="pill-dot"></span> Inactive
          </div>
        </div>
      </div>

    </mat-dialog-content>

    <!-- ── Footer ── -->
    <div class="dlg-footer">
      <div class="dlg-footer-hint">
        <span class="hint-key">ESC</span> to cancel
      </div>
      <div class="dlg-btn-group">
        <button class="dlg-btn dlg-btn-cancel" mat-dialog-close>
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button class="dlg-btn dlg-btn-primary" (click)="submit()">
          <mat-icon>{{ data.isEdit ? 'save' : 'add' }}</mat-icon>
          {{ data.isEdit ? 'Update Curriculum' : 'Create Curriculum' }}
        </button>
      </div>
    </div>

    <style>
      :host {
        display: flex;
        flex-direction: column;
        background: #111827;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #1e2d45;
        min-width: 520px;
        max-width: 560px;
        animation: dlgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      @keyframes dlgIn {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to   { opacity: 1; transform: none; }
      }

      /* ── Header ── */
      .dlg-head {
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid #1e3a5f;
        position: relative;
        flex-shrink: 0;
        overflow: hidden;
      }

      .dlg-head::after {
        content: '';
        position: absolute;
        top: -30px; right: -30px;
        width: 100px; height: 100px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
        pointer-events: none;
      }

      .dlg-head-icon {
        width: 36px; height: 36px;
        background: rgba(59,130,246,0.18);
        border: 1px solid rgba(59,130,246,0.38);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }

      .dlg-head-icon mat-icon {
        font-size: 18px; width: 18px; height: 18px;
        color: #60a5fa !important;
      }

      .dlg-head-text { flex: 1; }

      .dlg-head-text h2 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #e2e8f0;
        letter-spacing: -0.01em;
      }

      .dlg-head-text p {
        margin: 3px 0 0;
        font-size: 10px;
        color: #475569;
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: 0.07em;
      }

      .dlg-close {
        width: 30px; height: 30px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.08);
        background: transparent;
        color: #475569;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        transition: all 0.15s;
        flex-shrink: 0;
      }

      .dlg-close mat-icon { font-size: 16px; width: 16px; height: 16px; }

      .dlg-close:hover {
        background: rgba(255,255,255,0.06);
        color: #94a3b8;
      }

      /* ── Body ── */
      mat-dialog-content.dlg-body {
        padding: 22px 24px 16px !important;
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-height: 62vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #1e2d45 transparent;
      }

      mat-dialog-content.dlg-body::-webkit-scrollbar { width: 4px; }
      mat-dialog-content.dlg-body::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 4px; }

      /* ── Row layout ── */
      .dlg-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        align-items: start;
      }

      /* ── Field ── */
      .dlg-field {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .dlg-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-weight: 500;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.09em;
        font-family: 'JetBrains Mono', monospace;
      }

      .dlg-dot {
        width: 4px; height: 4px;
        border-radius: 50%;
        background: #3b82f6;
        flex-shrink: 0;
      }

      .dlg-req { color: #ef4444; font-size: 10px; }

      /* ── Select wrapper ── */
      .dlg-select-wrap {
        position: relative;
        display: flex;
        align-items: center;
      }

      .dlg-input-icon {
        position: absolute !important;
        left: 11px;
        font-size: 15px !important;
        width: 15px !important;
        height: 15px !important;
        color: #334155 !important;
        transition: color 0.2s;
        z-index: 1;
        pointer-events: none;
      }

      .dlg-select-wrap:focus-within .dlg-input-icon {
        color: #60a5fa !important;
      }

      .dlg-select {
        width: 100%;
        background: #0d1117;
        border: 1px solid #1e2d45;
        border-radius: 8px;
        color: #e2e8f0;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        padding: 10px 36px 10px 36px;
        outline: none;
        appearance: none;
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .dlg-select:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
      }

      /* styled options */
      .dlg-select option {
        background: #111827;
        color: #e2e8f0;
        padding: 8px;
      }

      .dlg-select-arrow {
        position: absolute !important;
        right: 10px;
        font-size: 16px !important;
        width: 16px !important;
        height: 16px !important;
        color: #334155 !important;
        pointer-events: none;
        transition: color 0.2s;
      }

      .dlg-select-wrap:focus-within .dlg-select-arrow {
        color: #60a5fa !important;
      }

      /* ── Year Level grid ── */
      .dlg-year-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
      }

      .dlg-year-card {
        background: #0d1117;
        border: 1px solid #1e2d45;
        border-radius: 8px;
        padding: 10px 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        cursor: pointer;
        transition: all 0.15s;
        user-select: none;
      }

      .dlg-year-card:hover:not(.selected) { border-color: #2d3f55; }

      .year-num {
        font-size: 18px;
        font-weight: 600;
        color: #334155;
        font-family: 'JetBrains Mono', monospace;
        line-height: 1;
        transition: color 0.15s;
      }

      .year-label {
        font-size: 9px;
        color: #334155;
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: 0.04em;
        transition: color 0.15s;
      }

      .dlg-year-card.selected {
        background: rgba(59,130,246,0.08);
        border-color: rgba(59,130,246,0.45);
      }

      .dlg-year-card.selected .year-num,
      .dlg-year-card.selected .year-label { color: #60a5fa; }

      /* ── Semester pills ── */
      .dlg-sem-col {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .dlg-sem-pill {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 9px 12px;
        background: #0d1117;
        border: 1px solid #1e2d45;
        border-radius: 8px;
        color: #475569;
        font-size: 12px;
        font-weight: 500;
        font-family: 'JetBrains Mono', monospace;
        cursor: pointer;
        transition: all 0.15s;
        user-select: none;
        letter-spacing: 0.02em;
      }

      .dlg-sem-pill:hover:not(.selected) { border-color: #2d3f55; color: #64748b; }

      .sem-icon {
        font-size: 14px !important;
        width: 14px !important;
        height: 14px !important;
        color: inherit !important;
      }

      .dlg-sem-pill.selected {
        background: rgba(99,179,237,0.08);
        border-color: rgba(99,179,237,0.45);
        color: #63b3ed;
      }

      /* ── School Year pills ── */
      .dlg-sy-row {
        display: flex;
        gap: 8px;
      }

      .dlg-sy-pill {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 9px 10px;
        background: #0d1117;
        border: 1px solid #1e2d45;
        border-radius: 8px;
        color: #475569;
        font-size: 11px;
        font-weight: 500;
        font-family: 'JetBrains Mono', monospace;
        cursor: pointer;
        transition: all 0.15s;
        user-select: none;
        letter-spacing: 0.02em;
      }

      .dlg-sy-pill:hover:not(.selected) { border-color: #2d3f55; color: #64748b; }

      .sy-icon {
        font-size: 12px !important;
        width: 12px !important;
        height: 12px !important;
        color: inherit !important;
      }

      .dlg-sy-pill.selected {
        background: rgba(183,148,246,0.08);
        border-color: rgba(183,148,246,0.45);
        color: #b794f6;
      }

      /* ── Status pills ── */
      .dlg-status-row {
        display: flex;
        gap: 8px;
      }

      .dlg-status-pill {
        flex: 1;
        padding: 9px 16px;
        border-radius: 8px;
        border: 1px solid #1e2d45;
        background: #0d1117;
        color: #475569;
        font-size: 12px;
        font-weight: 500;
        font-family: 'JetBrains Mono', monospace;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: all 0.15s;
        user-select: none;
        letter-spacing: 0.02em;
      }

      .dlg-status-pill:hover:not(.active) { border-color: #2d3f55; color: #64748b; }

      .pill-dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
        opacity: 0.5;
        transition: opacity 0.15s;
      }

      .dlg-status-pill.active .pill-dot { opacity: 1; }

      .dlg-status-pill:not(.dlg-status-inactive).active {
        background: rgba(52,211,153,0.08);
        border-color: rgba(52,211,153,0.38);
        color: #34d399;
      }

      .dlg-status-inactive.active {
        background: rgba(239,68,68,0.08);
        border-color: rgba(239,68,68,0.38);
        color: #f87171;
      }

      /* ── Footer ── */
      .dlg-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 24px;
        border-top: 1px solid #1a2538;
        background: #0d1117;
        flex-shrink: 0;
      }

      .dlg-footer-hint {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        color: #1e2d45;
        font-family: 'JetBrains Mono', monospace;
      }

      .hint-key {
        background: #131f30;
        border: 1px solid #1e2d45;
        border-radius: 4px;
        padding: 1px 6px;
        font-size: 9px;
        color: #334155;
      }

      .dlg-btn-group { display: flex; gap: 8px; }

      .dlg-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        border: none;
        outline: none;
      }

      .dlg-btn mat-icon {
        font-size: 15px !important;
        width: 15px !important;
        height: 15px !important;
      }

      .dlg-btn-cancel {
        background: transparent;
        border: 1px solid #1e2d45;
        color: #475569;
      }

      .dlg-btn-cancel:hover {
        border-color: #2d3f55;
        color: #64748b;
        background: rgba(255,255,255,0.02);
      }

      .dlg-btn-primary {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: #fff;
        box-shadow: 0 2px 12px rgba(37,99,235,0.3);
      }

      .dlg-btn-primary:hover {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 18px rgba(37,99,235,0.4);
      }

      .dlg-btn-primary:active { transform: scale(0.97); }
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

  yearLevels = [
    { value: 1, label: '1st' },
    { value: 2, label: '2nd' },
    { value: 3, label: '3rd' },
    { value: 4, label: '4th' },
  ];

  semesters = [
    { value: 1, label: '1st Semester', icon: 'looks_one' },
    { value: 2, label: '2nd Semester', icon: 'looks_two' },
  ];

  schoolYears = ['2024-2025', '2025-2026', '2026-2027'];

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

// ─────────────────────────────────────────────────────────────────────────────
// CurriculumList — unchanged logic, updated dialog wiring
// ─────────────────────────────────────────────────────────────────────────────
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
    try { this.courses = await this.courseService.getAll(); }
    catch { console.error('Failed to load courses'); }
  }

  async loadSubjects() {
    try { this.subjects = await this.subjectService.getAll(); }
    catch { console.error('Failed to load subjects'); }
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

  getSemesterLabel(semester: number) {
    return semester === 1 ? '1st Semester' : '2nd Semester';
  }

  private openDialog(data: any) {
    return this.dialog.open(CurriculumDialog, {
      data,
      panelClass: 'lnr-dialog-panel',
      backdropClass: 'lnr-dialog-backdrop',
    });
  }

  openAddDialog() {
    this.openDialog({ isEdit: false, courses: this.courses, subjects: this.subjects })
      .afterClosed()
      .subscribe(async result => {
        if (result) {
          try {
            await this.curriculumService.create(result);
            await this.loadCurriculums();
          } catch {
            this.errorMessage = 'Failed to create curriculum.';
          }
        }
      });
  }

  openEditDialog(curriculum: any) {
    this.openDialog({ isEdit: true, curriculum, courses: this.courses, subjects: this.subjects })
      .afterClosed()
      .subscribe(async result => {
        if (result) {
          try {
            await this.curriculumService.update(curriculum.id, result);
            await this.loadCurriculums();
          } catch {
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
      } catch {
        this.errorMessage = 'Failed to delete curriculum.';
      }
    }
  }
}