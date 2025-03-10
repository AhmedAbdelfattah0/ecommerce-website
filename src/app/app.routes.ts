import { HomeComponent } from './pages/home/home.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  {
    path: 'products', component: ProductsListComponent, data: { title: 'Products' },
    children: [
      { path: 'details/:id', loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent), data: { title: 'Product Details' } },
    ]
  },
];
