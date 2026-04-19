import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ContactService } from '../../core/services/contact.service';
import { NotificationService } from '../../core/services/notification.service';
import { Contact } from '../../shared/models/contact.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule],
  templateUrl: './contact-list.html',
  // styleUrls: ['./contact-list.css']
})
export class ContactList implements OnInit {
  contacts: Contact[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'message', 'createdAt'];

  constructor(
    private contactService: ContactService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getContacts().subscribe({
      next: (res) => {
        if (res.success) this.contacts = res.data;
      },
      error: () => this.notify.showError('Hiba az üzenetek betöltésekor')
    });
  }
}