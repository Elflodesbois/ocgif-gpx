import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarModeSelector } from '../../services/navbar-mode-selector';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  mode = inject(NavbarModeSelector);
 
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
        this.mode.changeMode('login');
      },
      error: err => {
        this.error = err.error?.error || 'Erreur création compte';
      }
    });
  }
}