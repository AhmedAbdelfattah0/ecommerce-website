import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product, Product_v2, ProductsResponse } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/products'; // Replace with your actual API endpoint
  isProductsLoading = signal(false);

  constructor(private http: HttpClient) { }

  getProducts(params?: {
    page: number,
    perPage: number,
    sort: string,
    filters: any
  }): Observable<Product[]> {
    this.isProductsLoading.set(true)
    return this.http.get<Product[]>(`${this.apiUrl}/get_products.php`, { params });
  }



  get_discounted_products(params?: {
    page: number,
    perPage: number,
    sort: string,
    filters: any
  }): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/get_discounted_products.php`, { params });
  }


  getProduct(id: number): Observable<Product_v2> {
    return this.http.get<Product_v2>(`${this.apiUrl}/get_product-v2.php/?id=${id}`);
  }

  getProductsByCategory(category: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/get_products_by_categoryId.php/?categoryId=${category}`);
  }
}
