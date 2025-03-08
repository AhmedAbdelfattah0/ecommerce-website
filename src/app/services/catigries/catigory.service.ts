import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Catigory } from '../../models/catigory';

@Injectable({
  providedIn: 'root'
})
export class CatigoryService {
 private apiUrl = '/categories'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getCatigories(): Observable<Catigory[]> {
    return this.http.get<Catigory[]>(`${this.apiUrl}/get_categories.php`);
    }

}
