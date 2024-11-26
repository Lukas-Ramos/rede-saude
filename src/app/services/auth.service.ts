import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    const user = localStorage.getItem('user');
    return !!user;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
