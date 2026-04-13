import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService, Category } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmationDialog } from '../../../shared/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css']
})
export class CategoryList implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['icon', 'name', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private notify: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.cdr.detectChanges();
      },
      error: () => this.notify.showError('Hiba a kategóriák betöltésekor')
    });
  }

  deleteCategory(category: Category) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { title: 'Kategória törlése', message: `Biztosan törlöd a "${category.name}" kategóriát? Csak akkor lehetséges, ha nincs hozzá rendelt termék.` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(category._id!).subscribe({
          next: () => {
            this.notify.showSuccess('Kategória törölve');
            this.loadCategories();
          },
          error: (err) => this.notify.showError(err.error?.message || 'Hiba a törlés során')
        });
      }
    });
  }
}