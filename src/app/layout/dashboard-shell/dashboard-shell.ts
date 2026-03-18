import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard-shell.html',
styleUrl: './dashboard-shell.scss'
})
export class DashboardShellComponent {

  navItems = [
    { label: 'Courses',     icon: 'menu_book',   route: '/dashboard/courses'     },
    { label: 'Curriculum',  icon: 'library_books',route: '/dashboard/curriculum'  },
    { label: 'Sections',    icon: 'class',        route: '/dashboard/sections'    },
    { label: 'Subjects', icon: 'book', route: '/dashboard/subjects' },
    { label: 'Enrollments', icon: 'how_to_reg',   route: '/dashboard/enrollments' },
    { label: 'Students',    icon: 'people',       route: '/dashboard/students'    },
    
  ];

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
