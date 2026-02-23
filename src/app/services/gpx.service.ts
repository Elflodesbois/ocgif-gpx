import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GpxService {

  private apiUrl = "http://localhost:"+environment.backendPort+"/api/gpx";

  constructor(private http: HttpClient) {}

  uploadTrace(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getTraces() {
    return this.http.get<any[]>('http://localhost:'+environment.backendPort+'/api/gpx');
  }

  downloadTrace(id: number) {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
  }


}
