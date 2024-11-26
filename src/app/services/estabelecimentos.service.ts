import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstabelecimentosService {
  private apiUrl = 'http://localhost:3000/estabelecimentos';

  constructor(private http: HttpClient) {}

  getEstabelecimentos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addEstabelecimento(estabelecimento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, estabelecimento);
  }

  deleteEstabelecimento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateEstabelecimento(id: number, estabelecimento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estabelecimento);
  }
}
