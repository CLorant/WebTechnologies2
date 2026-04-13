import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-form.html'
})
export class UserForm implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.minLength(6)]]
    });

    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode = true;
      this.userService.getUser(this.userId).subscribe({
        next: (res) => {
          const { name, email, phone } = res.data;
          this.userForm.patchValue({ name, email, phone });
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
        },
        error: () => this.notify.showError('Hiba a felhasználó betöltésekor')
      });
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    const userData = this.userForm.value;
    if (!this.isEditMode) {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.notify.showSuccess('Felhasználó létrehozva');
          this.router.navigate(['/user-list']);
        },
        error: () => this.notify.showError('Hiba a létrehozáskor')
      });
    } else {
      this.userService.updateUser(this.userId!, userData).subscribe({
        next: () => {
          this.notify.showSuccess('Felhasználó módosítva');
          this.router.navigate(['/user-list']);
        },
        error: () => this.notify.showError('Hiba a módosításkor')
      });
    }
  }
}