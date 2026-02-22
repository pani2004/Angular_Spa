import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { User } from '../../models/user.model';
import { EditUserDialog } from '../edit-user-dialog/edit-user-dialog';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  users: User[] = [];
  loading = false;
  error: string | null = null;
  currentUser: User | null = null;
  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: User | null) => {
      this.currentUser = user;
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load users';
        this.loading = false;
        if (this.error) {
          this.snackBar.open(this.error, 'Close', { duration: 5000 });
        }
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserDialog, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(user.userId, result);
      }
    });
  }

  updateUser(userId: string, data: Partial<User>): void {
    this.userService.updateUser(userId, data).subscribe({
      next: (response) => {
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.loadUsers(); // Reload users
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to update user';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      }
    });
  }

  deleteUser(userId: string, email: string): void {
    if (confirm(`Are you sure you want to delete user: ${email}?`)) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers(); // Reload users
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Failed to delete user';
          this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
        }
      });
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
