import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EnrollmentService } from '../../../core/services/enrollment';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    TitleCasePipe,
  ],
  templateUrl: './enrollment-list.html',
  styleUrl: './enrollment-list.scss'
})
export class EnrollmentList implements OnInit {
  displayedColumns = ['student_id', 'section_id', 'status', 'actions'];
  enrollments: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private enrollmentService: EnrollmentService) {}

  async ngOnInit() {
    await this.loadEnrollments();
  }

  async loadEnrollments() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.enrollments = await this.enrollmentService.getAll();
    } catch (error: any) {
      this.errorMessage = 'Failed to load enrollments. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async approve(id: number) {
    try {
      await this.enrollmentService.approve(id);
      await this.loadEnrollments();
    } catch (error) {
      this.errorMessage = 'Failed to approve enrollment.';
    }
  }

  async reject(id: number) {
    try {
      await this.enrollmentService.reject(id);
      await this.loadEnrollments();
    } catch (error) {
      this.errorMessage = 'Failed to reject enrollment.';
    }
  }
}