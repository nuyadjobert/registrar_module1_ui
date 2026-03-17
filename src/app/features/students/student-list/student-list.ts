import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentService } from '../../../core/services/student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss'
})
export class StudentList implements OnInit {
  displayedColumns = ['student_number', 'name', 'course', 'actions'];
  students: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private studentService: StudentService) {}

  async ngOnInit() {
    await this.loadStudents();
  }

  async loadStudents() {
    this.loading = true;
    this.errorMessage = '';
    try {
      this.students = await this.studentService.getAll();
    } catch (error: any) {
      this.errorMessage = 'Failed to load students. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  async viewCOR(id: number) {
    try {
      const data = await this.studentService.getCOR(id);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      this.errorMessage = 'Failed to get COR.';
    }
  }

  async viewTranscript(id: number) {
    try {
      const data = await this.studentService.getTranscript(id);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      this.errorMessage = 'Failed to get transcript.';
    }
  }
}