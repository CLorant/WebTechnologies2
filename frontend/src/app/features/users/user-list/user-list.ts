import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmationDialog} from '../../../shared/confirmation-dialog/confirmation-dialog';
import { SearchFilter } from '../../../shared/search-filter/search-filter';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    SearchFilter,
    FilterPipe
  ],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserList implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];
  filterText = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private notify: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load users error:', err);
        this.notify.showError('Hiba a felhasználók betöltésekor');
      }
    });
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { title: 'Felhasználó törlése', message: `Biztosan törölni szeretnéd ${user.name} felhasználót?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user._id!).subscribe({
          next: () => {
            this.notify.showSuccess('Felhasználó törölve');
            this.loadUsers();
          },
          error: () => this.notify.showError('Hiba a törlés során')
        });
      }
    });
  }

  onSearch(value: string) {
    this.filterText = value;
  }
}