import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
 
  username = '';
  password = '';
  error = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  register() {
    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        alert('Compte créé avec succès');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.error = err.error?.error || 'Erreur création compte';
      }
    });
  }
}