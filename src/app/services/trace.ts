import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Trace {
  private baseUrl = 'http://localhost:'+environment.backendPort+'/api/gpx';

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
