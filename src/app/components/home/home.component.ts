import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare let L: any; 

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  user = { name: 'João Silva' };

  activeTab: string = 'mapa';
  estabelecimentos: any[] = [];
  novoEstabelecimento = { nome: '', imagem: '', latitude: null, longitude: null };

  private map: any;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
    L.marker([51.505, -0.09]).addTo(this.map).bindPopup('Bem-vindo ao mapa!').openPopup();
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'mapa' && this.map) {
      this.map.invalidateSize();
    }
  }

  cadastrarEstabelecimento() {
    if (this.novoEstabelecimento.latitude && this.novoEstabelecimento.longitude) {
      const { nome, latitude, longitude } = this.novoEstabelecimento;
      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(nome || 'Novo Estabelecimento')
        .openPopup();
      this.estabelecimentos.push({ ...this.novoEstabelecimento });
      this.novoEstabelecimento = { nome: '', imagem: '', latitude: null, longitude: null };
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
