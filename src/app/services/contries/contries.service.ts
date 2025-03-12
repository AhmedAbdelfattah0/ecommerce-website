import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContriesService {
  // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  private middleEastCountries = [
    'Bahrain',
    'Iran',
    'Iraq',
    'Israel',
    'Jordan',
    'Kuwait',
    'Lebanon',
    'Oman',
    'Qatar',
    'Saudi Arabia',
    'United Arab Emirates',
    'Yemen',
    'Turkey', 'Egypt', 'Palestine'
  ];
  // getContries(): Observable<any> {
  //   return this.http.get<any>(`countries/countries.php`).pipe(
  //     map(response => response.data.filter((country: any) =>
  //       this.middleEastCountries.includes(country.name)
  //     ))
  //   );
  // }
  getContries(): Observable<any[]> {
    return this.http.get<any>(`countries/countries.php`)
    // .pipe(
    //   map(response => {
    //     return response.data
    //       // Optional: if you want to filter only for Middle East countries
    //       .filter((country: any) => this.middleEastCountries.includes(country.name))
    //       // Map each country to the desired structure
    //       .map((country: any) => ({
    //         name: country.name,
    //         states: Array.isArray(country.states)
    //           ? country.states.map((state: any) => ({ name: state.name }))
    //           : []
    //       }));
    //   })
    // );
  }
}
