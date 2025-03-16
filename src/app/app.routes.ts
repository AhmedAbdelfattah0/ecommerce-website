import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { Routes } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContactUsComponent } from './pages/contsct-us/contact-us/contact-us.component';
import { HotDealsComponent } from './pages/hot-deals/hot-deals.component';
import { FavoriteComponent } from './pages/favorites-list/favorite.component';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: 'home', title: 'Home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'products', component: ProductsListComponent, data: { title: 'Products' } },
  { path: 'deals', component: HotDealsComponent, data: { title: 'Hot Deals' } },
  { path: 'products/details/:id', component: ProductDetailsComponent, title: 'Product Details', data: { title: 'Product Details' } },
  { path: 'cart', component: CartComponent, title: 'Shopping Cart', data: { title: 'Shopping Cart' } },
  { path: 'favorites', component: FavoriteComponent, title: 'Favorites List', data: { title: 'Favorites List' } },
  { path: 'checkout', component: CheckoutComponent, title: 'Checkout', data: { title: 'Checkout' } },
  { path: 'contact', component: ContactUsComponent, title: 'Constact Us', data: { title: 'Contact Us' } },
  { path: "**", redirectTo: 'home' }
];
