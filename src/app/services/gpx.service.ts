import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GpxService {

  private apiUrl = "http://localhost:3000/api/gpx";

  constructor(private http: HttpClient) {}

   uploadTrace(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
