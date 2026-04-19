import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WeeklyMenuDay } from '../../shared/models/weekly-menu.model';

@Injectable({ providedIn: 'root' })
export class WeeklyMenuService {
  private apiUrl = `${environment.apiUrl}/weekly-menu`;

  constructor(private http: HttpClient) {}

  getWeeklyMenu(): Observable<WeeklyMenuDay[]> {
    return this.http.get<WeeklyMenuDay[]>(this.apiUrl);
  }

  updateWeeklyMenu(menu: WeeklyMenuDay[]): Observable<any> {
    return this.http.put(this.apiUrl, { menu });
  }
}