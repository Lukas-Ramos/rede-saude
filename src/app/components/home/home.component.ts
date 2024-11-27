import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';  

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
  estabelecimentos: any[] = [];
  icons = [
   'fas fa-store', 
    'fas fa-utensils',
    'fas fa-cogs', 
    'fas fa-cocktail', 
    'fas fa-shopping-cart', 
    'fas fa-bread-slice',
    'fas fa-concierge-bell', 
    'fas fa-cutlery', 
    'fas fa-burger', 
    'fas fa-tshirt', 
  ];
  
  iconGalleryVisible = false;
  novoEstabelecimento = { nome: '', imagem: '', latitude: null, longitude: null };
  private map: any;
  private tempMarker: any = null;
  isLoading: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngAfterViewInit() {
    this.initMap();
    this.carregarEstabelecimentos();
  }

  toggleIconGallery() {
    this.iconGalleryVisible = !this.iconGalleryVisible; 
  }

  selectIcon(icon: string) {
    this.novoEstabelecimento.imagem = icon; 
    this.iconGalleryVisible = false; 
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
    if (this.map) {
      this.map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
  
      estabelecimentos.forEach((estabelecimento) => {
        if (estabelecimento.latitude && estabelecimento.longitude) {
          const icon = L.divIcon({
            className: 'fa ' + estabelecimento.imagem, 
            iconSize: [80, 80],
            iconAnchor: [20, 40], 
            popupAnchor: [0, -40]  
          });
  
          L.marker([estabelecimento.latitude, estabelecimento.longitude], { icon })
            .addTo(this.map)
            .bindPopup(`<strong>${estabelecimento.nome}</strong>`)
            .openPopup();
        }
      });
    }
  }

  initMap() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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

          this.map.on('click', (e: any) => {
            const { lat, lng } = e.latlng;

            this.novoEstabelecimento.latitude = lat;
            this.novoEstabelecimento.longitude = lng;

            if (this.tempMarker) {
              this.map.removeLayer(this.tempMarker);
            }

            const icon = L.divIcon({
              className: this.novoEstabelecimento.imagem ? this.novoEstabelecimento.imagem : 'fa fa-map-marker',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
              popupAnchor: [0, -40]
            });

            this.tempMarker = L.marker([lat, lng], { draggable: true, icon })
              .addTo(this.map);

            this.tempMarker.bindPopup('Local Temporário').openPopup();
          });

          this.carregarEstabelecimentos();
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          this.map = L.map('map').setView([51.505, -0.09], 13); 
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(this.map);
  
          this.carregarEstabelecimentos();
        }
      );
    } else {
      console.error('Geolocalização não é suportada por este navegador.');
    }
  }

  cadastrarEstabelecimento() {
    if (
      this.novoEstabelecimento.nome &&
      this.novoEstabelecimento.imagem && 
      this.novoEstabelecimento.latitude &&
      this.novoEstabelecimento.longitude
    ) {
      const { nome, imagem, latitude, longitude } = this.novoEstabelecimento;

      const icon = L.divIcon({
        className: 'fa ' + imagem,  
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([latitude, longitude], { icon })
        .addTo(this.map)
        .bindPopup(`<strong>${nome}</strong>`)
        .openPopup();

      this.isLoading = true;

      this.http.post('http://localhost:3000/estabelecimentos', this.novoEstabelecimento).subscribe(
        (response) => {
          setTimeout(() => {
            this.estabelecimentos.push({ ...this.novoEstabelecimento });
            this.novoEstabelecimento = { nome: '', imagem: '', latitude: null, longitude: null };

            this.isLoading = false;
            this.atualizarMapaComEstabelecimentos(this.estabelecimentos);
            this.carregarEstabelecimentos();
          }, 1000);
        },
        (error) => {
          console.error('Erro ao cadastrar estabelecimento', error);
          this.isLoading = false;
        }
      );
    } else {
      alert('Por favor, preencha todos os campos do estabelecimento.');
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

  excluirEstabelecimento(id: number) {
    if (!id) {
      console.error('ID inválido para exclusão');
      return;
    }
  
    this.http.delete(`http://localhost:3000/estabelecimentos/${id}`).subscribe(
      () => {
        this.estabelecimentos = this.estabelecimentos.filter((est) => est.id !== id);
        this.atualizarMapaComEstabelecimentos(this.estabelecimentos);
      },
      (error) => {
        console.error('Erro ao excluir estabelecimento', error);
        alert('Erro ao excluir o estabelecimento. Tente novamente mais tarde.');
      }
    );
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
