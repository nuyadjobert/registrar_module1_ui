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

// ─────────────────────────────────────────────────────────────────────────────
// SectionDialog
// ─────────────────────────────────────────────────────────────────────────────
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
    <!-- ── Header ── -->
    <div class="dlg-head">
      <div class="dlg-head-icon">
        <mat-icon>class</mat-icon>
      </div>
      <div class="dlg-head-text">
        <h2>{{ data.isEdit ? 'Edit Section' : 'Add Section' }}</h2>
        <p>{{ data.isEdit ? 'ACADEMIC REGISTRY · UPDATE ENTRY' : 'ACADEMIC REGISTRY · NEW ENTRY' }}</p>
      </div>
      <button class="dlg-close" mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <!-- ── Body ── -->
    <mat-dialog-content class="dlg-body">

      <!-- Row: Section Name + Capacity -->
      <div class="dlg-row">
        <div class="dlg-field">
          <label class="dlg-label">
            <span class="dlg-dot"></span>Section Name
            <span class="dlg-req">*</span>
          </label>
          <div class="dlg-input-wrap">
            <mat-icon class="dlg-input-icon">tag</mat-icon>
            <input
              class="dlg-input"
              [(ngModel)]="form.section_name"
              placeholder="e.g. BSCS-1A"
              maxlength="20"
              (input)="nameLen = form.section_name.length"
            />
            <span class="dlg-counter">{{ nameLen }}/20</span>
          </div>
        </div>

        <div class="dlg-field dlg-field-sm">
          <label class="dlg-label">
            <span class="dlg-dot"></span>Capacity
          </label>
          <div class="dlg-input-wrap">
            <mat-icon class="dlg-input-icon">people</mat-icon>
            <input
              class="dlg-input"
              type="number"
              [(ngModel)]="form.capacity"
              placeholder="40"
              min="1"
              max="999"
            />
          </div>
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
              <mat-icon class="pill-icon">calendar_today</mat-icon>
              {{ sy }}
            </div>
          }
        </div>
      </div>

      <!-- Semester -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Semester
          <span class="dlg-req">*</span>
        </label>
        <div class="dlg-sem-row">
          @for (s of semesters; track s.value) {
            <div
              class="dlg-sem-pill"
              [class.selected]="form.semester === s.value"
              (click)="form.semester = s.value"
            >
              <mat-icon class="pill-icon">{{ s.icon }}</mat-icon>
              {{ s.value }}
            </div>
          }
        </div>
      </div>

      <!-- Section Status -->
      <div class="dlg-field">
        <label class="dlg-label">
          <span class="dlg-dot"></span>Status
        </label>
        <div class="dlg-status-row">
          <div
            class="dlg-status-pill dlg-open"
            [class.active]="form.status === 'Open'"
            (click)="form.status = 'Open'"
          >
            <span class="pill-dot"></span> Open
          </div>
          <div
            class="dlg-status-pill dlg-full"
            [class.active]="form.status === 'Full'"
            (click)="form.status = 'Full'"
          >
            <span class="pill-dot"></span> Full
          </div>
          <div
            class="dlg-status-pill dlg-closed"
            [class.active]="form.status === 'Closed'"
            (click)="form.status = 'Closed'"
          >
            <span class="pill-dot"></span> Closed
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
          <mat-icon>close</mat-icon> Cancel
        </button>
        <button class="dlg-btn dlg-btn-primary" (click)="submit()">
          <mat-icon>{{ data.isEdit ? 'save' : 'add' }}</mat-icon>
          {{ data.isEdit ? 'Update Section' : 'Create Section' }}
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
        min-width: 500px;
        max-width: 540px;
        animation: dlgIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
      }
      @keyframes dlgIn {
        from { opacity:0; transform:translateY(16px) scale(0.97); }
        to   { opacity:1; transform:none; }
      }
      .dlg-head {
        background: linear-gradient(135deg,#0f3460 0%,#16213e 100%);
        padding: 20px 24px;
        display: flex; align-items: center; gap: 12px;
        border-bottom: 1px solid #1e3a5f;
        position: relative; overflow: hidden; flex-shrink: 0;
      }
      .dlg-head::after {
        content:''; position:absolute; top:-30px; right:-30px;
        width:100px; height:100px; border-radius:50%;
        background:radial-gradient(circle,rgba(59,130,246,0.18) 0%,transparent 70%);
        pointer-events:none;
      }
      .dlg-head-icon {
        width:36px; height:36px;
        background:rgba(59,130,246,0.18); border:1px solid rgba(59,130,246,0.38);
        border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;
      }
      .dlg-head-icon mat-icon { font-size:18px!important; width:18px!important; height:18px!important; color:#60a5fa!important; }
      .dlg-head-text { flex:1; }
      .dlg-head-text h2 { margin:0; font-size:15px; font-weight:600; color:#e2e8f0; letter-spacing:-0.01em; }
      .dlg-head-text p  { margin:3px 0 0; font-size:10px; color:#475569; font-family:'JetBrains Mono',monospace; letter-spacing:0.07em; }
      .dlg-close {
        width:30px; height:30px; border-radius:6px;
        border:1px solid rgba(255,255,255,0.08); background:transparent;
        color:#475569; display:flex; align-items:center; justify-content:center;
        cursor:pointer; transition:all 0.15s; flex-shrink:0;
      }
      .dlg-close mat-icon { font-size:16px!important; width:16px!important; height:16px!important; }
      .dlg-close:hover { background:rgba(255,255,255,0.06); color:#94a3b8; }

      mat-dialog-content.dlg-body {
        padding:22px 24px 16px!important; display:flex; flex-direction:column; gap:16px;
        max-height:60vh; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#1e2d45 transparent;
      }
      mat-dialog-content.dlg-body::-webkit-scrollbar { width:4px; }
      mat-dialog-content.dlg-body::-webkit-scrollbar-thumb { background:#1e2d45; border-radius:4px; }

      .dlg-row { display:grid; grid-template-columns:1fr 110px; gap:12px; }

      .dlg-field { display:flex; flex-direction:column; gap:7px; }

      .dlg-label {
        display:flex; align-items:center; gap:6px;
        font-size:10px; font-weight:500; color:#64748b;
        text-transform:uppercase; letter-spacing:0.09em;
        font-family:'JetBrains Mono',monospace;
      }
      .dlg-dot { width:4px; height:4px; border-radius:50%; background:#3b82f6; flex-shrink:0; }
      .dlg-req { color:#ef4444; font-size:10px; }

      .dlg-input-wrap { position:relative; display:flex; align-items:center; }
      .dlg-input-icon {
        position:absolute!important; left:11px;
        font-size:15px!important; width:15px!important; height:15px!important;
        color:#334155!important; transition:color 0.2s; z-index:1; pointer-events:none;
      }
      .dlg-input-wrap:focus-within .dlg-input-icon { color:#60a5fa!important; }
      .dlg-input {
        width:100%; background:#0d1117; border:1px solid #1e2d45; border-radius:8px;
        color:#e2e8f0; font-family:'Inter',sans-serif; font-size:13px;
        padding:10px 12px 10px 36px; outline:none; transition:border-color 0.2s,box-shadow 0.2s;
      }
      .dlg-input::placeholder { color:#1e2d45; }
      .dlg-input:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.12); }
      .dlg-input[type="number"]::-webkit-outer-spin-button,
      .dlg-input[type="number"]::-webkit-inner-spin-button { -webkit-appearance:none; }
      .dlg-input[type="number"] { -moz-appearance:textfield; }
      .dlg-counter { position:absolute; right:10px; font-size:10px; color:#1e2d45; font-family:'JetBrains Mono',monospace; pointer-events:none; transition:color 0.2s; }
      .dlg-input-wrap:focus-within .dlg-counter { color:#334155; }

      .dlg-select-wrap { position:relative; display:flex; align-items:center; }
      .dlg-select {
        width:100%; background:#0d1117; border:1px solid #1e2d45; border-radius:8px;
        color:#e2e8f0; font-family:'Inter',sans-serif; font-size:13px;
        padding:10px 36px 10px 36px; outline:none; appearance:none; cursor:pointer;
        transition:border-color 0.2s,box-shadow 0.2s;
      }
      .dlg-select:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.12); }
      .dlg-select option { background:#111827; color:#e2e8f0; }
      .dlg-select-arrow { position:absolute!important; right:10px; font-size:16px!important; width:16px!important; height:16px!important; color:#334155!important; pointer-events:none; }
      .dlg-select-wrap:focus-within .dlg-select-arrow,
      .dlg-select-wrap:focus-within .dlg-input-icon { color:#60a5fa!important; }

      /* School Year pills */
      .dlg-sy-row { display:flex; gap:8px; }
      .dlg-sy-pill {
        flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
        padding:9px 8px; background:#0d1117; border:1px solid #1e2d45; border-radius:8px;
        color:#475569; font-size:11px; font-weight:500; font-family:'JetBrains Mono',monospace;
        cursor:pointer; transition:all 0.15s; user-select:none; letter-spacing:0.02em;
      }
      .dlg-sy-pill:hover:not(.selected) { border-color:#2d3f55; color:#64748b; }
      .dlg-sy-pill.selected { background:rgba(183,148,246,0.08); border-color:rgba(183,148,246,0.45); color:#b794f6; }

      /* Semester pills */
      .dlg-sem-row { display:flex; gap:8px; }
      .dlg-sem-pill {
        flex:1; display:flex; align-items:center; justify-content:center; gap:7px;
        padding:9px 12px; background:#0d1117; border:1px solid #1e2d45; border-radius:8px;
        color:#475569; font-size:12px; font-weight:500; font-family:'JetBrains Mono',monospace;
        cursor:pointer; transition:all 0.15s; user-select:none; letter-spacing:0.02em;
      }
      .dlg-sem-pill:hover:not(.selected) { border-color:#2d3f55; color:#64748b; }
      .dlg-sem-pill.selected { background:rgba(99,179,237,0.08); border-color:rgba(99,179,237,0.45); color:#63b3ed; }

      .pill-icon { font-size:13px!important; width:13px!important; height:13px!important; color:inherit!important; }

      /* Section status - 3 states */
      .dlg-status-row { display:flex; gap:8px; }
      .dlg-status-pill {
        flex:1; padding:9px 12px; border-radius:8px; border:1px solid #1e2d45;
        background:#0d1117; color:#475569; font-size:12px; font-weight:500;
        font-family:'JetBrains Mono',monospace; display:flex; align-items:center; gap:8px;
        cursor:pointer; transition:all 0.15s; user-select:none; letter-spacing:0.02em;
      }
      .dlg-status-pill:hover:not(.active) { border-color:#2d3f55; color:#64748b; }
      .pill-dot { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; opacity:0.5; transition:opacity 0.15s; }
      .dlg-status-pill.active .pill-dot { opacity:1; }
      .dlg-open.active  { background:rgba(52,211,153,0.08); border-color:rgba(52,211,153,0.38); color:#34d399; }
      .dlg-full.active  { background:rgba(251,191,36,0.08); border-color:rgba(251,191,36,0.38); color:#fbbf24; }
      .dlg-closed.active{ background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.38); color:#f87171; }

      /* Footer */
      .dlg-footer {
        display:flex; align-items:center; justify-content:space-between;
        padding:14px 24px; border-top:1px solid #1a2538; background:#0d1117; flex-shrink:0;
      }
      .dlg-footer-hint { display:flex; align-items:center; gap:6px; font-size:10px; color:#1e2d45; font-family:'JetBrains Mono',monospace; }
      .hint-key { background:#131f30; border:1px solid #1e2d45; border-radius:4px; padding:1px 6px; font-size:9px; color:#334155; }
      .dlg-btn-group { display:flex; gap:8px; }
      .dlg-btn {
        display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border-radius:8px;
        font-family:'Inter',sans-serif; font-size:13px; font-weight:500;
        cursor:pointer; transition:all 0.15s; border:none; outline:none;
      }
      .dlg-btn mat-icon { font-size:15px!important; width:15px!important; height:15px!important; }
      .dlg-btn-cancel { background:transparent; border:1px solid #1e2d45; color:#475569; }
      .dlg-btn-cancel:hover { border-color:#2d3f55; color:#64748b; background:rgba(255,255,255,0.02); }
      .dlg-btn-primary { background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%); color:#fff; box-shadow:0 2px 12px rgba(37,99,235,0.3); }
      .dlg-btn-primary:hover { background:linear-gradient(135deg,#3b82f6 0%,#2563eb 100%); transform:translateY(-1px); box-shadow:0 4px 18px rgba(37,99,235,0.4); }
      .dlg-btn-primary:active { transform:scale(0.97); }
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

  nameLen = 0;

  schoolYears = ['2024-2025', '2025-2026', '2026-2027'];

  semesters = [
    { value: '1st Semester', icon: 'looks_one' },
    { value: '2nd Semester', icon: 'looks_two' },
    { value: 'Summer',       icon: 'wb_sunny'  },
  ];

  constructor(
    public dialogRef: MatDialogRef<SectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.section) {
      this.form    = { ...data.section };
      this.nameLen = (this.form.section_name || '').length;
    }
  }

  submit() { this.dialogRef.close(this.form); }
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionList
// ─────────────────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [
    MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDialogModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, FormsModule,
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
    this.loading = true; this.errorMessage = '';
    try {
      this.sections = await this.sectionService.getAll();
      this.filteredSections = this.sections;
    } catch (e: any) { this.errorMessage = 'Failed to load sections.'; }
    finally { this.loading = false; }
  }

  async loadSubjects() {
    try { this.subjects = await this.subjectService.getAll(); }
    catch { console.error('Failed to load subjects'); }
  }

  search() {
    const t = this.searchText.toLowerCase();
    this.filteredSections = this.sections.filter(s =>
      s.section_name?.toLowerCase().includes(t) ||
      s.subject?.subject_name?.toLowerCase().includes(t) ||
      s.school_year?.toLowerCase().includes(t) ||
      s.semester?.toLowerCase().includes(t) ||
      s.status?.toLowerCase().includes(t)
    );
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) { this.searchText = ''; this.filteredSections = this.sections; }
  }

  private openDialog(data: any) {
    return this.dialog.open(SectionDialog, {
      data,
      panelClass: 'lnr-dialog-panel',
      backdropClass: 'lnr-dialog-backdrop',
    });
  }

  openAddDialog() {
    this.openDialog({ isEdit: false, subjects: this.subjects })
      .afterClosed().subscribe(async result => {
        if (result) {
          try { await this.sectionService.create(result); await this.loadSections(); }
          catch { this.errorMessage = 'Failed to create section.'; }
        }
      });
  }

  openEditDialog(section: any) {
    this.openDialog({ isEdit: true, section, subjects: this.subjects })
      .afterClosed().subscribe(async result => {
        if (result) {
          try { await this.sectionService.update(section.id, result); await this.loadSections(); }
          catch { this.errorMessage = 'Failed to update section.'; }
        }
      });
  }

  async deleteSection(id: number) {
    if (confirm('Are you sure you want to delete this section?')) {
      try { await this.sectionService.delete(id); await this.loadSections(); }
      catch { this.errorMessage = 'Failed to delete section.'; }
    }
  }
}