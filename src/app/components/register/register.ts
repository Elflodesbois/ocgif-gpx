import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarModeSelector } from '../../services/navbar-mode-selector';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  mode = inject(NavbarModeSelector);

  username = '';
  password = '';
  confirmPassword = '';
  error = '';

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  register() {

    // Vérification mot de passe
    if (this.password !== this.confirmPassword) {
      this.error = "Les mots de passe ne correspondent pas";
      return;
    }

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
