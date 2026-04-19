import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservation } from '../../shared/models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = `${environment.apiUrl}/reservation`;

  constructor(private http: HttpClient) {}

  getReservations(): Observable<{ success: boolean; data: Reservation[] }> {
    return this.http.get<{ success: boolean; data: Reservation[] }>(this.apiUrl);
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}