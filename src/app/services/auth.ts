import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  register(username: string, password: string) {
    return this.http.post<any>('http://localhost:3000/api/users/register', { username, password });
  }

  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:3000/api/users/login', { username, password })
      .pipe(
        tap(res => {
          if (res.token) {
            localStorage.setItem(this.tokenKey, res.token);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
