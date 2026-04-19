import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WeeklyMenuService } from '../../core/services/weekly-menu.service';
import { NotificationService } from '../../core/services/notification.service';
import { WeeklyMenuDay } from '../../shared/models/weekly-menu.model';

@Component({
  selector: 'app-weekly-menu',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './weekly-menu.html',
  styleUrls: ['./weekly-menu.css']
})
export class WeeklyMenu implements OnInit {
  menuForm!: FormGroup;
  days = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek'];

  constructor(
    private fb: FormBuilder,
    private weeklyMenuService: WeeklyMenuService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      days: this.fb.array([])
    });
    this.loadMenu();
  }

  get daysArray(): FormArray {
    return this.menuForm.get('days') as FormArray;
  }

  loadMenu() {
    this.weeklyMenuService.getWeeklyMenu().subscribe({
      next: (menu) => {
        this.daysArray.clear();
        menu.forEach((day: WeeklyMenuDay) => {
          this.daysArray.push(
            this.fb.group({
              A: [day.A, Validators.required],
              B: [day.B, Validators.required],
              C: [day.C, Validators.required],
              dessert: [day.dessert, Validators.required]
            })
          );
        });
      },
      error: () => this.notify.showError('Hiba a heti menü betöltésekor')
    });
  }

  save() {
    if (this.menuForm.invalid) {
      this.notify.showError('Kérjük töltse ki az összes mezőt');
      return;
    }
    const menu: WeeklyMenuDay[] = this.daysArray.value;
    this.weeklyMenuService.updateWeeklyMenu(menu).subscribe({
      next: () => this.notify.showSuccess('Heti menü frissítve'),
      error: () => this.notify.showError('Hiba a mentés során')
    });
  }
}