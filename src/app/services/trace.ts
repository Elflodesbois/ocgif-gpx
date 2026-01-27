import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Trace {
  private baseUrl = 'http://localhost:3000/api/gpx';

  constructor(private http: HttpClient) {}

  getMyTraces() {
    return this.http.get<any[]>(`${this.baseUrl}/mes-traces`);
  }

  deleteTrace(id: number) {
     return this.http.delete(`${this.baseUrl}/mes-traces/${id}`);
  }

  getNiveau() {
    return this.http.get<any[]>(`${this.baseUrl}/niveau`);
  }
  
}
