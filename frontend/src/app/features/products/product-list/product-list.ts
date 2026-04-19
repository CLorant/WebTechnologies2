import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { ProductService, Product } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmationDialog } from '../../../shared/confirmation-dialog/confirmation-dialog';
import { SearchFilter } from '../../../shared/search-filter/search-filter';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    SearchFilter
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filterText = '';
  selectedCategory = '';
  categories: Category[] = [];
  imageVersion = Date.now();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private notify: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load categories error:', err);
        this.notify.showError('Hiba a kategóriák betöltésekor');
      }
    });
  }

  loadProducts() {
    const categoryId = this.selectedCategory || undefined;
    this.productService.getProducts(categoryId, this.filterText || undefined).subscribe({
      next: (res) => {
        this.products = res.data;
        this.imageVersion = Date.now();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load products error:', err);
        this.notify.showError('Hiba a termékek betöltésekor');
      }
    });
  }

  deleteProduct(product: Product) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { title: 'Termék törlése', message: `Biztosan törlöd a következő terméket: ${product.name}?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(product._id!).subscribe({
          next: () => {
            this.notify.showSuccess('Termék törölve');
            this.loadProducts();
          },
          error: () => this.notify.showError('Hiba a törlés során')
        });
      }
    });
  }

  onSearch(value: string) {
    this.filterText = value;
    this.loadProducts();
  }

  onCategoryChange(categoryId: string) {
    this.selectedCategory = categoryId;
    this.loadProducts();
  }
}