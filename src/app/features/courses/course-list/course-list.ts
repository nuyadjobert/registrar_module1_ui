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

// ─────────────────────────────────────────────────────────────────────────────
// CourseDialog — Enhanced inline dialog component
// ─────────────────────────────────────────────────────────────────────────────
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
    <!-- ── Header ── -->
    <div class="dlg-head">
      <div class="dlg-head-icon">
        <mat-icon>menu_book</mat-icon>
      </div>
      <div class="dlg-head-text">
        <h2>{{ data.isEdit ? 'Edit Course' : 'Add Course' }}</h2>
        <p>{{ data.isEdit ? 'ACADEMIC REGISTRY · UPDATE ENTRY' : 'ACADEMIC REGISTRY · NEW ENTRY' }}</p>
      </div>
      <button class="dlg-close" mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <!-- ── Body ── -->
    <mat-dialog-content class="dlg-body">

      <!-- Row: Code + Units -->
      <div class="dlg-row">
        <div class="dlg-field">
          <label class="dlg-label">
            <span class="dlg-dot"></span>Course Code
            <span class="dlg-req">*</span>
          </label>
          <div class="dlg-input-wrap">
            <mat-icon class="dlg-input-icon">tag</mat-icon>
            <input
              class="dlg-input"
              [(ngModel)]="form.course_code"
              placeholder="e.g. BSCS"
              maxlength="12"
              (input)="codeLen = form.course_code.length"
            />
            <span class="dlg-counter">{{ codeLen }}/12</span>
          </div>
        </div>

        <div class="dlg-field dlg-field-sm">
          <label class="dlg-label">
            <span class="dlg-dot"></span>Units
            <span class="dlg-req">*</span>
          </label>
          <div class="dlg-input-wrap">
            <mat-icon class="dlg-input-icon">grid_view</mat-icon>
            <input
              class="dlg-input"
              type="number"
              [(ngModel)]="form.units"
              placeholder="0"
              min="0"
              max="12"
            />
          </div>
        </div>
      </div>

      <!-- Course Name -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Course Name
          <span class="dlg-req">*</span>
        </label>
        <div class="dlg-input-wrap">
          <mat-icon class="dlg-input-icon">title</mat-icon>
          <input
            class="dlg-input"
            [(ngModel)]="form.course_name"
            placeholder="e.g. Bachelor of Science in Computer Science"
            maxlength="100"
            (input)="nameLen = form.course_name.length"
          />
          <span class="dlg-counter">{{ nameLen }}/100</span>
        </div>
      </div>

      <!-- Department -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Department
        </label>
        <div class="dlg-input-wrap">
          <mat-icon class="dlg-input-icon">business</mat-icon>
          <input
            class="dlg-input"
            [(ngModel)]="form.department"
            placeholder="e.g. College of Information Technology"
          />
        </div>
      </div>

      <!-- Course Type — card selector -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Course Type
          <span class="dlg-req">*</span>
        </label>
        <div class="dlg-type-grid">
          @for (t of courseTypes; track t.value) {
            <div
              class="dlg-type-card"
              [class.selected]="form.type === t.value"
              [attr.data-type]="t.value"
              (click)="form.type = t.value"
            >
              <mat-icon class="type-icon">{{ t.icon }}</mat-icon>
              <span class="type-label">{{ t.label }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Status — pill toggle -->
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

      <!-- Description -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Description
          <span class="dlg-optional">(optional)</span>
        </label>
        <div class="dlg-input-wrap dlg-textarea-wrap">
          <mat-icon class="dlg-input-icon dlg-textarea-icon">description</mat-icon>
          <textarea
            class="dlg-input dlg-textarea"
            [(ngModel)]="form.description"
            placeholder="Brief description of the course..."
            rows="3"
          ></textarea>
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
          {{ data.isEdit ? 'Update Course' : 'Create Course' }}
        </button>
      </div>
    </div>

    <!-- ── Scoped dialog styles ── -->
    <style>
      /* ─── Host / reset ─── */
      :host {
        display: flex;
        flex-direction: column;
        background: #111827;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #1e2d45;
        min-width: 500px;
        max-width: 540px;
        animation: dlgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      @keyframes dlgIn {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to   { opacity: 1; transform: none; }
      }

      /* ─── Header ─── */
      .dlg-head {
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid #1e3a5f;
        position: relative;
        flex-shrink: 0;
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

      .dlg-head-text {
        flex: 1;
      }

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

      .dlg-close mat-icon {
        font-size: 16px; width: 16px; height: 16px;
      }

      .dlg-close:hover {
        background: rgba(255,255,255,0.06);
        color: #94a3b8;
      }

      /* ─── Body ─── */
      mat-dialog-content.dlg-body {
        padding: 22px 24px 16px !important;
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-height: 60vh;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #1e2d45 transparent;
      }

      mat-dialog-content.dlg-body::-webkit-scrollbar { width: 4px; }
      mat-dialog-content.dlg-body::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 4px; }

      /* ─── Row layout ─── */
      .dlg-row {
        display: grid;
        grid-template-columns: 1fr 120px;
        gap: 12px;
      }

      /* ─── Field ─── */
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

      .dlg-optional {
        color: #334155;
        font-size: 9px;
        letter-spacing: 0.06em;
      }

      /* ─── Input wrapper ─── */
      .dlg-input-wrap {
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
        flex-shrink: 0;
      }

      .dlg-input-wrap:focus-within .dlg-input-icon {
        color: #60a5fa !important;
      }

      .dlg-input {
        width: 100%;
        background: #0d1117;
        border: 1px solid #1e2d45;
        border-radius: 8px;
        color: #e2e8f0;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        padding: 10px 12px 10px 36px;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .dlg-input::placeholder { color: #1e2d45; }

      .dlg-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
      }

      /* hide number input arrows */
      .dlg-input[type="number"]::-webkit-outer-spin-button,
      .dlg-input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
      .dlg-input[type="number"] { -moz-appearance: textfield; }

      .dlg-counter {
        position: absolute;
        right: 10px;
        font-size: 10px;
        color: #1e2d45;
        font-family: 'JetBrains Mono', monospace;
        pointer-events: none;
        transition: color 0.2s;
      }

      .dlg-input-wrap:focus-within .dlg-counter { color: #334155; }

      /* textarea */
      .dlg-textarea-wrap { align-items: flex-start; }
      .dlg-textarea-icon { top: 12px; }

      .dlg-textarea {
        resize: none;
        line-height: 1.6;
        padding-top: 10px;
      }

      /* ─── Course Type grid ─── */
      .dlg-type-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }

      .dlg-type-card {
        background: #0d1117;
        border: 1px solid #1e2d45;
        border-radius: 8px;
        padding: 11px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        transition: all 0.15s;
        user-select: none;
      }

      .dlg-type-card:hover:not(.selected) {
        border-color: #2d3f55;
      }

      .type-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
        color: #334155 !important;
        transition: color 0.15s;
      }

      .type-label {
        font-size: 10px;
        font-weight: 500;
        color: #475569;
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: 0.04em;
        transition: color 0.15s;
      }

      /* Major selected */
      .dlg-type-card[data-type="Major"].selected {
        background: rgba(59,130,246,0.08);
        border-color: rgba(59,130,246,0.45);
      }
      .dlg-type-card[data-type="Major"].selected .type-icon { color: #60a5fa !important; }
      .dlg-type-card[data-type="Major"].selected .type-label { color: #60a5fa; }

      /* Minor selected */
      .dlg-type-card[data-type="Minor"].selected {
        background: rgba(99,179,237,0.08);
        border-color: rgba(99,179,237,0.45);
      }
      .dlg-type-card[data-type="Minor"].selected .type-icon { color: #63b3ed !important; }
      .dlg-type-card[data-type="Minor"].selected .type-label { color: #63b3ed; }

      /* Elective selected */
      .dlg-type-card[data-type="Elective"].selected {
        background: rgba(183,148,246,0.08);
        border-color: rgba(183,148,246,0.45);
      }
      .dlg-type-card[data-type="Elective"].selected .type-icon { color: #b794f6 !important; }
      .dlg-type-card[data-type="Elective"].selected .type-label { color: #b794f6; }

      /* GE selected */
      .dlg-type-card[data-type="General Education"].selected {
        background: rgba(251,146,60,0.08);
        border-color: rgba(251,146,60,0.45);
      }
      .dlg-type-card[data-type="General Education"].selected .type-icon { color: #fb923c !important; }
      .dlg-type-card[data-type="General Education"].selected .type-label { color: #fb923c; }

      /* ─── Status pills ─── */
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

      /* Active (green) */
      .dlg-status-pill:not(.dlg-status-inactive).active {
        background: rgba(52,211,153,0.08);
        border-color: rgba(52,211,153,0.38);
        color: #34d399;
      }

      /* Inactive (red) */
      .dlg-status-inactive.active {
        background: rgba(239,68,68,0.08);
        border-color: rgba(239,68,68,0.38);
        color: #f87171;
      }

      /* ─── Footer ─── */
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

      .dlg-btn-group {
        display: flex;
        gap: 8px;
      }

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

  codeLen = 0;
  nameLen = 0;

  courseTypes = [
    { value: 'Major',             label: 'Major',   icon: 'menu_book' },
    { value: 'Minor',             label: 'Minor',   icon: 'bookmark' },
    { value: 'Elective',          label: 'Elective',icon: 'electric_bolt' },
    { value: 'General Education', label: 'Gen Ed',  icon: 'public' },
  ];

  constructor(
    public dialogRef: MatDialogRef<CourseDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.course) {
      this.form     = { ...data.course };
      this.codeLen  = (this.form.course_code  || '').length;
      this.nameLen  = (this.form.course_name  || '').length;
    }
  }

  submit() {
    this.dialogRef.close(this.form);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CourseList — main list component (unchanged logic, enhanced dialog wiring)
// ─────────────────────────────────────────────────────────────────────────────
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

  private openDialog(data: any) {
    return this.dialog.open(CourseDialog, {
      data,
      panelClass: 'lnr-dialog-panel',
      backdropClass: 'lnr-dialog-backdrop',
    });
  }

  openAddDialog() {
    this.openDialog({ isEdit: false })
      .afterClosed()
      .subscribe(async result => {
        if (result) {
          try {
            await this.courseService.create(result);
            await this.loadCourses();
          } catch {
            this.errorMessage = 'Failed to create course.';
          }
        }
      });
  }

  openEditDialog(course: any) {
    this.openDialog({ isEdit: true, course })
      .afterClosed()
      .subscribe(async result => {
        if (result) {
          try {
            await this.courseService.update(course.id, result);
            await this.loadCourses();
          } catch {
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
      } catch {
        this.errorMessage = 'Failed to delete course.';
      }
    }
  }
}