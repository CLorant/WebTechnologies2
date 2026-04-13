import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  menuItems = [
    { path: '/dashboard', label: 'Irányítópult', icon: 'dashboard' },
    { path: '/user-list', label: 'Felhasználók', icon: 'people' },
    { path: '/category-list', label: 'Kategóriák', icon: 'category' },
    { path: '/product-list', label: 'Termékek', icon: 'restaurant_menu' }
  ];
}