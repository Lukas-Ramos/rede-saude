import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos!';
      return;
    }

    this.http
      .get<any[]>(`http://localhost:3000/users?username=${this.username}&password=${this.password}`)
      .subscribe({
        next: (users) => {
          if (users.length > 0) {
            this.errorMessage = '';
            localStorage.setItem('user', JSON.stringify(users[0])); 
            this.router.navigate(['/home']); 
          } else {
            this.errorMessage = 'Credenciais inválidas. Tente novamente.';
          }
        },
        error: () => {
          this.errorMessage = 'Erro ao verificar credenciais. Tente novamente.';
        },
      });
  }
}
