import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  isLoggedIn = false;
  @Output() toggleSidenavEvent = new EventEmitter<void>();

  constructor(public auth: AuthService, private router: Router) {
    this.auth.currentUser$.subscribe(() => {
      this.isLoggedIn = this.auth.isLoggedIn();
    });
  }

  ngOnInit(): void {}

  toggleSidenav() {
    this.toggleSidenavEvent.emit();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}