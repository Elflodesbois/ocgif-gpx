import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  username = '';
  password = '';
  error = '';

  constructor(private auth: Auth, private router: Router) {}

  register() {
    this.auth.register(this.username, this.password).subscribe({
      next: res => {
        alert('Compte créé !');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.error = err.error.error || 'Erreur création compte';
      }
    });
  }
}
