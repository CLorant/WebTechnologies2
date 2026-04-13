import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { ProductService, Product } from '../../../core/services/product.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ImageUpload
  ],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  categories: Category[] = [];
  imageFile: File | null = null;
  imagePreview: string | null = null;
  imageFileName = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      img: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });

    // Load categories
    this.categoryService.getCategories().subscribe({
      next: (res) => this.categories = res.data,
      error: () => this.notify.showError('Hiba a kategóriák betöltésekor')
    });

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.productService.getProduct(this.productId).subscribe({
        next: (res) => {
          const product = res.data;
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            img: product.img,
            price: product.price,
            category: product.category?._id || product.category
          });
        },
        error: () => this.notify.showError('Hiba a termék betöltésekor')
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      this.imageFileName = this.imageFile.name;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(this.imageFile);
    }
  }

  onImageSelected(file: File) {
    this.imageFile = file;
    this.productForm.patchValue({ img: '' });
  }

  onSubmit() {
  if (this.productForm.invalid) return;
  const productData = { ...this.productForm.value };
  
  // Remove img from productData if it's empty (will be set after upload)
  if (!productData.img) delete productData.img;

  if (!this.isEditMode) {
    // Create product first to get ID
    this.productService.createProduct(productData).subscribe({
      next: (res) => {
        const productId = res.data._id;
        if (this.imageFile) {
          const formData = new FormData();
          formData.append('image', this.imageFile);
          formData.append('productName', productData.name);
          formData.append('productId', productId);
          this.productService.uploadImage(formData).subscribe({
            next: (uploadRes) => {
              this.productService.updateProduct(productId, { img: uploadRes.imagePath } as Product).subscribe({
                next: () => {
                  this.notify.showSuccess('Termék létrehozva');
                  this.router.navigate(['/product-list']);
                },
                error: () => this.notify.showError('Hiba a kép mentésekor')
              });
            },
            error: () => this.notify.showError('Hiba a kép feltöltésekor')
          });
        } else {
          this.notify.showSuccess('Termék létrehozva');
          this.router.navigate(['/product-list']);
        }
      },
      error: () => this.notify.showError('Hiba a létrehozáskor')
    });
  } else {
    // Edit mode
    const updateObservable = this.imageFile
      ? this.uploadAndUpdateProduct(productData)
      : this.productService.updateProduct(this.productId!, productData);
    
    updateObservable.subscribe({
      next: () => {
        this.notify.showSuccess('Termék módosítva');
        this.router.navigate(['/product-list']);
      },
      error: () => this.notify.showError('Hiba a módosításkor')
    });
  }
}

private uploadAndUpdateProduct(productData: any): Observable<any> {
  const formData = new FormData();
  formData.append('image', this.imageFile!);
  formData.append('productName', productData.name);
  formData.append('productId', this.productId!);
  
  return new Observable(observer => {
    this.productService.uploadImage(formData).subscribe({
      next: (uploadRes) => {
        productData.img = uploadRes.imagePath;
        this.productService.updateProduct(this.productId!, productData).subscribe({
          next: (res) => { observer.next(res); observer.complete(); },
          error: (err) => observer.error(err)
        });
      },
      error: (err) => observer.error(err)
    });
  });
}
}