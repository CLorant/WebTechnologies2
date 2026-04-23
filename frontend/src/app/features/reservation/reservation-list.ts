import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ReservationService } from '../../core/services/reservation.service';
import { NotificationService } from '../../core/services/notification.service';
import { Reservation } from '../../shared/models/reservation.model';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatChipsModule],
  templateUrl: './reservation-list.html',
  styleUrls: ['./reservation-list.css']
})
export class ReservationList implements OnInit {
  reservations: Reservation[] = [];
  displayedColumns: string[] = ['name', 'date', 'time', 'guests', 'location', 'options', 'createdAt'];

  constructor(
    private reservationService: ReservationService,
    private notify: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getReservations().subscribe({
      next: (res) => {
        if (res.success) {
          this.reservations = res.data;
          this.cdr.detectChanges();
        } else {
          this.notify.showError('Hiba a foglalások betöltésekor');
        }
      },
      error: () => this.notify.showError('Hálózati hiba')
    });
  }
}