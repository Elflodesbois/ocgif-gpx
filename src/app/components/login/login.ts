import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarModeSelector } from '../../services/navbar-mode-selector';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = '';
  password = '';
  error = '';

  mode = inject(NavbarModeSelector);

  constructor(private auth: Auth, private router: Router) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: res => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error.error || 'Erreur connexion';
      }
    });
  }
}