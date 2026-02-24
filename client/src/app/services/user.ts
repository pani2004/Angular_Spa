import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, RecordsResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/profile`, {
      withCredentials: true
    });
  }

  getUserRecords(delay: number = 0): Observable<RecordsResponse> {
    return this.http.get<RecordsResponse>(`${environment.apiUrl}/users/records?delay=${delay}`, {
      withCredentials: true
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/admin/users`, {
      withCredentials: true
    });
  }

  updateUser(userId: string, userData: Partial<User>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/admin/users/${userId}`, userData, {
      withCredentials: true
    });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/admin/users/${userId}`, {
      withCredentials: true
    });
  }
}
