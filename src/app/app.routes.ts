import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { DashboardShellComponent } from './layout/dashboard-shell/dashboard-shell';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    component: DashboardShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/courses/course-list/course-list').then(m => m.CourseList)
      },
      {
        path: 'curriculum',
        loadComponent: () =>
          import('./features/curriculum/curriculum-list/curriculum-list').then(m => m.CurriculumList)
      },
      {
        path: 'sections',
        loadComponent: () =>
          import('./features/section/section-list/section-list').then(m => m.SectionList)
      },
      {
        path: 'enrollments',
        loadComponent: () =>
          import('./features/enrollments/enrollment-list/enrollment-list').then(m => m.EnrollmentList)
      },
      {
        path: 'students',
        loadComponent: () =>
          import('./features/students/student-list/student-list').then(m => m.StudentList)
      },
      {
    path: 'subjects',
    loadComponent: () =>
        import('./features/subjects/subject-list/subject-list').then(m => m.SubjectList)
},
      {
        path: '',
        redirectTo: 'courses',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];