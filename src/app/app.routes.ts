import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';  
import { CadastroComponent } from './components/cadastro/cadastro.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },  
  { path: 'home', component: HomeComponent },  
  { path: 'cadastro', component: CadastroComponent },  
  { path: '**', redirectTo: '/login' }  
];
