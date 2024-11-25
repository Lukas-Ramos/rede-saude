import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule], 
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

    this.http.get<any[]>(`http://localhost:3000/users?username=${this.username}&password=${this.password}`).subscribe({
      next: (users) => {
        if (users.length > 0) {
          this.errorMessage = '';  
          this.router.navigate(['/home']);  
        } else {
          this.errorMessage = 'Credenciais inválidas. Tente novamente.';
        }
      },
      error: (error) => {
        console.error('Erro ao verificar credenciais', error);
        this.errorMessage = 'Erro ao verificar credenciais. Tente novamente.';
      }
    });
  }
}
