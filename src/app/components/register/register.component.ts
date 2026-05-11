import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  numeroLicence: number | null = null;
  error = signal('');

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const request = {
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      role: 'PHARMACIEN',
      numeroLicence: this.numeroLicence
    };

    this.http.post('http://localhost:8080/api/auth/register', request).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error.set('Erreur lors de l\'inscription. L\'email est peut-être déjà utilisé.')
    });
  }
}
