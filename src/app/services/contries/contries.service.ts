import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContriesService {
  // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }



  getContries(): Observable<any[]> {
    return this.http.get<any>(`/countries/countries.php`)

  }
}
