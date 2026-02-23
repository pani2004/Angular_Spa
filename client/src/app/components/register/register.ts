import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth';
import { RegisterRequest, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  error = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

    return passwordValid ? null : {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecial
      }
    };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    // Split name into firstName and lastName
    const fullName = this.registerForm.value.name.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const registerData: RegisterRequest = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      firstName: firstName,
      lastName: lastName,
      role: UserRole.USER
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/login'], {
            queryParams: { registered: 'true' }
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getPasswordErrors(): string {
    const control = this.registerForm.get('password');
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Password is required';
    if (control.errors['minlength']) return 'Password must be at least 8 characters';
    if (control.errors['passwordStrength']) {
      const errors = control.errors['passwordStrength'];
      const missing: string[] = [];
      if (!errors.hasUpperCase) missing.push('uppercase letter');
      if (!errors.hasLowerCase) missing.push('lowercase letter');
      if (!errors.hasNumeric) missing.push('number');
      if (!errors.hasSpecial) missing.push('special character');
      return `Password must contain: ${missing.join(', ')}`;
    }
    return '';
  }
}
