import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { User, UserRecord, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);

  currentUser: User | null = null;
  records: UserRecord[] = [];
  loading = false;
  error: string | null = null;
  selectedDelay = 0;
  displayedColumns: string[] = ['id', 'name', 'description', 'createdAt'];

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === UserRole.ADMIN;
  }

  onDelayChange(): void {
    // Optional: Auto-load records when delay changes
    // this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUserRecords(this.selectedDelay).subscribe({
      next: (response) => {
        this.records = response.data.records;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load records';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
