import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contact } from '../../shared/models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`;

  constructor(private http: HttpClient) {}

  getContacts(): Observable<{ success: boolean; data: Contact[] }> {
    return this.http.get<{ success: boolean; data: Contact[] }>(this.apiUrl);
  }

  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}