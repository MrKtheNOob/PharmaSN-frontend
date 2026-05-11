import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  pharmacy = signal<any>(null);
  success = signal(false);
  error = signal('');

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.http.get('http://localhost:8080/api/pharmacies/mine').subscribe({
      next: (res) => this.pharmacy.set(res),
      error: (err) => this.error.set('Impossible de charger le profil')
    });
  }

  onUpdate() {
    this.http.put('http://localhost:8080/api/pharmacies/mine', this.pharmacy()).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.success.set(false), 3000);
      },
      error: () => this.error.set('Erreur lors de la mise à jour')
    });
  }
}
