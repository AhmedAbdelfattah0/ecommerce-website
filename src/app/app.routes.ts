import { ProductsListComponent } from './pages/products-list/products-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {path:"", redirectTo:"/home", pathMatch:"full"},
  {path:'home', loadComponent:()=>import('./pages/home/home.component').then(m=>m.HomeComponent), data:{title:'Home'}  },
  {path:'products', loadComponent:()=>import('./pages/products-list/products-list.component').then(m=>m.ProductsListComponent), data:{title:'Products'}  },
];
