import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';  // Importando o HttpClient

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

  constructor(private router: Router, private http: HttpClient) {}

  ngAfterViewInit() {
    this.initMap();
    this.carregarEstabelecimentos()
    
  }
  carregarEstabelecimentos() {
    this.http.get<any[]>('http://localhost:3000/estabelecimentos').subscribe(
      (response) => {
        this.estabelecimentos = response;
        this.atualizarMapaComEstabelecimentos(response);
      },
      (error) => {
        console.error('Erro ao carregar os estabelecimentos', error);
      }
    );
  }
  
  atualizarMapaComEstabelecimentos(estabelecimentos: any[]) {
    // Limpar os marcadores anteriores no mapa
    if (this.map) {
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
  
      // Adicionar os marcadores dos estabelecimentos ao mapa
      estabelecimentos.forEach((estabelecimento) => {
        const icon = L.icon({
          iconUrl: estabelecimento.imagem || 'default-image-url.png',
          iconSize: [40, 40],  
          className: 'rounded-marker',
        });
  
        L.marker([estabelecimento.latitude, estabelecimento.longitude], { icon })
          .addTo(this.map)
          .bindPopup(`<strong>${estabelecimento.nome}</strong>`)
          .openPopup();
      });
    }
  }
  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        this.map = L.map('map').setView([userLat, userLon], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
        
        L.marker([userLat, userLon])
          .addTo(this.map)
          .bindPopup('Você está aqui!')
          .openPopup();
      }, (error) => {
        console.error('Erro ao obter localização:', error);
        this.map = L.map('map').setView([51.505, -0.09], 13); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);
      });
    }
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'mapa' && this.map) {
      this.map.invalidateSize();
    }
  }

  cadastrarEstabelecimento() {
    if (this.novoEstabelecimento.latitude && this.novoEstabelecimento.longitude) {
      const { nome, imagem, latitude, longitude } = this.novoEstabelecimento;
  
      const icon = L.icon({
        iconUrl: imagem || 'default-image-url.png',
        iconSize: [40, 40],  
        className: 'rounded-marker',
      });
  
      const marker = L.marker([latitude, longitude], { icon })
        .addTo(this.map)
        .bindPopup(`<strong>${nome}</strong>`)
        .openPopup();
  
      // Enviar para a API
      this.http.post('http://localhost:3000/estabelecimentos', this.novoEstabelecimento).subscribe(
        (response) => {
          this.estabelecimentos.push({ ...this.novoEstabelecimento });
          this.novoEstabelecimento = { nome: '', imagem: '', latitude: null, longitude: null };
        },
        (error) => {
          console.error('Erro ao cadastrar estabelecimento', error);
        }
      );
    }
  }
  

  abrirNoGoogleMaps(latitude: number, longitude: number) {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    } else {
      alert('Coordenadas inválidas!');
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
