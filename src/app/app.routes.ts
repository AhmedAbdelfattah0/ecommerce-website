import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: 'home',  title:'Home' , component: HomeComponent, data: { title: 'Home' } },
  {
    path: 'products', component: ProductsListComponent, data: { title: 'Products' },

  },
  { path: 'products/details/:id', component: ProductDetailsComponent, title:'Product Details'  , data: { title: 'Product Details' } },
];
