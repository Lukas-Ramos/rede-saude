import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  cadastrar() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos!';
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/users?username=${this.username}`).subscribe({
      next: (users) => {
        if (users.length > 0) {
          this.errorMessage = 'Usuário já cadastrado!';
        } else {
          this.errorMessage = '';  
          const newUser = {
            username: this.username,
            password: this.password
          };

          this.http.post('http://localhost:3000/users', newUser).subscribe({
            next: (response) => {
              console.log('Usuário cadastrado com sucesso!', response);
              this.successMessage = 'Usuário cadastrado com sucesso!';
              setTimeout(() => {
                this.router.navigate(['/login']);  
              }, 2000);
            },
            error: (error) => {
              console.error('Erro ao cadastrar usuário', error);
              this.errorMessage = 'Erro ao cadastrar. Tente novamente.';
            }
          });
        }
      },
      error: (error) => {
        console.error('Erro ao verificar usuário', error);
        this.errorMessage = 'Erro ao verificar usuário. Tente novamente.';
      }
    });
  }
}
