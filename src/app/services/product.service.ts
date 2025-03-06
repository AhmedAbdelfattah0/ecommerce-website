import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/products'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/get_products.php`);

    // Mock data fallback
    /*
    return of([
      {
        id: 1,
        name: 'Modern Chair',
        price: 299.99,
        description: 'Contemporary ergonomic design',
        image: 'assets/chair.jpg',
        category: 'chairs',
        stock: 15,
        rating: 4.5
      },
      // ... more products
    ]);
    */
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get_product.php/?id=${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
  }
}
