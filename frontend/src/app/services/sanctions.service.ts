import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SanctionsService {
  private apiBase = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  searchSanctions(query: string, page = 1, pageSize = 5): Observable<any> {
    let params = new HttpParams()
      .set('name', query)
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    return this.http.get<any>(`${this.apiBase}/search/`, { params });
  }

  saveRiskDecision(data: any): Observable<any> {
    return this.http.post(`${this.apiBase}/save-decision/`, data);
  }
}
