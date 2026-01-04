import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Trace {
  constructor(private http: HttpClient) {}

  getMyTraces() {
    return this.http.get<any[]>('/api/traces/mes-traces');
  }

  deleteTrace(id: number) {
    return this.http.delete(`/api/traces/mes-traces/${id}`);
  }
}
