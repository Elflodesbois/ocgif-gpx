import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink  } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = '';
  password = '';
  error = '';

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