import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interface matching the actual API response item
export interface BannerData {
  id: string;
  fileUrl: string;
  visible: boolean;
  selected: boolean;
  created_at: string;
}

// Interface for our component to use
export interface Banner {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  link?: string;
  order?: number;
}

// Interface for the API response wrapper
export interface ApiResponse {
  success: boolean;
  data: BannerData[];
}

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBanners(): Observable<Banner[]> {
    return this.http.get<ApiResponse>(`/banners/get_banners.php`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            // Filter visible and selected banners, map to our Banner interface
            return response.data
              .filter(banner => banner.visible && banner.selected)
              .map((item, index) => ({
                id: item.id,
                image_url: item.fileUrl,
                order: index // Use the index as a simple ordering mechanism
              }));
          }
          return [];
        })
      );
  }
}
