import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null> = this.currentUserSubject.asObservable();

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAdmin(): boolean {
    return this.currentUserValue?.role === UserRole.ADMIN;
  }

  public get isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data.user) {
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
      })
    );
  }

  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true
    }).pipe(
      tap(response => {
        if (response.success && response.data.user) {
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/refresh`, {}, {
      withCredentials: true
    });
  }
}
