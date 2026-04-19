import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService, Category } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ImageUpload } from '../../../shared/image-upload/image-upload';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ImageUpload
  ],
  templateUrl: './category-form.html'
})
export class CategoryForm implements OnInit {
  categoryForm!: FormGroup;
  isEditMode = false;
  categoryId: string | null = null;
  iconFile: File | null = null;
  existingIconUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      icon: ['']
    });

    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.isEditMode = true;
      this.categoryService.getCategory(this.categoryId).subscribe({
        next: (res) => {
          const category = res.data;
          this.categoryForm.patchValue({
            name: category.name,
            icon: category.icon
          });
          this.existingIconUrl = category.icon;
        },
        error: () => this.notify.showError('Hiba a kategória betöltésekor')
      });
    }
  }

  onIconSelected(file: File) {
    this.iconFile = file;
    this.categoryForm.patchValue({ icon: '' });
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    const categoryData = { name: this.categoryForm.value.name };

    if (!this.isEditMode) {
      this.categoryService.createCategory({ ...categoryData, icon: '' }).subscribe({
        next: (res) => {
          const newCategoryId = res.data._id;
          if (this.iconFile) {
            const formData = new FormData();
            formData.append('image', this.iconFile);
            formData.append('categoryName', categoryData.name);
            formData.append('categoryId', newCategoryId);
            formData.append('oldImagePath', this.existingIconUrl || '');
            this.categoryService.uploadIcon(formData).subscribe({
              next: (uploadRes) => {
                this.categoryService.updateCategory(newCategoryId, { icon: uploadRes.imagePath }).subscribe({
                  next: () => {
                    this.notify.showSuccess('Kategória létrehozva');
                    this.router.navigate(['/category-list']);
                  }
                });
              }
            });
          }
          else {
            this.notify.showSuccess('Kategória létrehozva');
            this.router.navigate(['/category-list']);
          }
        },
        error: (err) => this.notify.showError(err.error?.message || 'Hiba a létrehozáskor')
      });
    }
    else {
      const updateData: any = { name: categoryData.name };
      if (this.iconFile) {
        const formData = new FormData();
        formData.append('image', this.iconFile);
        formData.append('categoryName', categoryData.name);
        formData.append('categoryId', this.categoryId!);
        this.categoryService.uploadIcon(formData).subscribe({
          next: (uploadRes) => {
            updateData.icon = uploadRes.imagePath;
            this.categoryService.updateCategory(this.categoryId!, updateData).subscribe({
              next: () => {
                this.notify.showSuccess('Kategória módosítva');
                this.router.navigate(['/category-list']);
              }
            });
          }
        });
      }
      else {
        if (this.existingIconUrl) updateData.icon = this.existingIconUrl;
        this.categoryService.updateCategory(this.categoryId!, updateData).subscribe({
          next: () => {
            this.notify.showSuccess('Kategória módosítva');
            this.router.navigate(['/category-list']);
          },
          error: () => this.notify.showError('Hiba a módosításkor')
        });
      }
    }
  }
}