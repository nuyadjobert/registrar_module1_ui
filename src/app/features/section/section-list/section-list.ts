import { Component, OnInit, Inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SectionService } from '../../../core/services/section';

@Component({
  selector: 'app-section-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Edit Section' : 'Add Section' }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Section Name</mat-label>
        <input matInput [(ngModel)]="form.section_name" placeholder="e.g. BSCS-1A" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Subject ID</mat-label>
        <input matInput type="number" [(ngModel)]="form.subject_id" placeholder="e.g. 1" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Capacity</mat-label>
        <input matInput type="number" [(ngModel)]="form.capacity" placeholder="e.g. 40" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" (click)="submit()">
        {{ data.isEdit ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
    <style>
      .full-width { width: 100%; margin-bottom: 8px; }
      mat-dialog-content { display: flex; flex-direction: column; min-width: 400px; padding-top: 16px; }
    </style>
  `
})
export class SectionDialog {
  form = {
    section_name: '',
    subject_id: null,
    capacity: null,
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
  ],
  templateUrl: './section-list.html',
  styleUrl: './section-list.scss'
})
export class SectionList implements OnInit {
  displayedColumns = ['section_name', 'subject_id', 'capacity', 'actions'];
  sections: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private sectionService: SectionService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadSections();
  }

  async loadSections() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.sections = await this.sectionService.getAll();
    } catch (error: any) {
      this.errorMessage = 'Failed to load sections. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(SectionDialog, {
      data: { isEdit: false }
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
      data: { isEdit: true, section }
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