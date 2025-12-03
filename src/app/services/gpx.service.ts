import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GpxService {

  private apiUrl = "http://localhost:3000/api/gpx";

  constructor(private http: HttpClient) {}

  uploadGPX(name: string, description: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
