import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, ProductsResponse } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/products'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getProducts(params?: {
    page: number,
    perPage: number,
    sort: string,
    filters: any
  }): Observable<ProductsResponse[]> {
    return this.http.get<ProductsResponse[]>(`${this.apiUrl}/get_products.php`, { params });
    }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get_product.php/?id=${id}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
  }
}
