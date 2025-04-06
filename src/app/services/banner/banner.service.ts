import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';



// Interface for our component to use
export interface Banner {
  id: string;
  fileUrl: string;
  visible: boolean;
  selected: boolean;
  created_at: string;
   order?: number;
}

// Interface for the API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: HttpClient) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get<ApiResponse<Banner[]>>(`/banners/get_banners.php`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Filter visible and selected banners, map to our Banner interface
            return response.data
              .filter(banner => banner.visible && banner.selected)

          }
          return [];
        })
      );
  }
}
