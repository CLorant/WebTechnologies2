import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.restoreUserFromToken();
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  }

  private restoreUserFromToken(): void {
    const token = this.getToken();
    if (!token) return;

    const decoded = this.decodeToken(token);
    if (decoded && decoded.userId) {
      const user: User = {
        _id: decoded.userId,
        name: decoded.name || '',
        email: decoded.email || '',
        phone: decoded.phone || '',
      };
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      map((res: any) => {
        if (res.success && res.token) {
          localStorage.setItem('token', res.token);
          // User info from response is more reliable than decoding
          this.currentUserSubject.next(res.user);
        }
        return res;
      })
    );
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      map((res: any) => {
        if (res.success && res.token) {
          localStorage.setItem('token', res.token);
          this.currentUserSubject.next(res.user);
        }
        return res;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      const expirationDate = new Date(decoded.exp * 1000);
      if (expirationDate < new Date()) {
        this.logout();
        return false;
      }
    }
    return true;
  }
}