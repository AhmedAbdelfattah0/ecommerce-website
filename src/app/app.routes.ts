import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { Routes } from '@angular/router';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContactUsComponent } from './pages/contsct-us/contact-us.component';
import { HotDealsComponent } from './pages/hot-deals/hot-deals.component';
import { FavoriteComponent } from './pages/favorites-list/favorite.component';

export const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Home',
      seo: {
        title: 'Home',
        description: 'Discover premium furniture and home decor at Lugar Store. Elegant designs for modern homes.',
        keywords: 'furniture store, home decor, premium furniture, living room furniture, bedroom furniture'
      }
    }
  },
  {
    path: 'products',
    component: ProductsListComponent,
    data: {
      title: 'Products',
      seo: {
        title: 'Our Furniture Collection',
        description: 'Browse our extensive collection of high-quality furniture. From sofas to dining tables, find the perfect piece for your home.',
        keywords: 'furniture, sofas, tables, chairs, bedroom furniture, living room furniture, dining room'
      }
    }
  },
  {
    path: 'deals',
    component: HotDealsComponent,
    data: {
      title: 'Hot Deals',
      seo: {
        title: 'Special Offers & Hot Deals',
        description: 'Explore our limited-time offers and special deals on premium furniture and home decor items.',
        keywords: 'furniture deals, discounted furniture, special offers, limited time deals, sale, discount'
      }
    }
  },
  {
    path: 'products/details/:id',
    component: ProductDetailsComponent,
    data: {
      title: 'Product Details',
      seo: {
        title: 'Product Details',
        description: 'View detailed information about our premium furniture pieces.',
        keywords: 'furniture details, product specifications, furniture dimensions, materials'
      }
    }
  },
  {
    path: 'cart',
    component: CartComponent,
    data: {
      title: 'Shopping Cart',
      seo: {
        title: 'Your Shopping Cart',
        description: 'Review and manage items in your shopping cart before checkout.',
        keywords: 'shopping cart, checkout, furniture purchase, buy furniture'
      }
    }
  },
  {
    path: 'favorites',
    component: FavoriteComponent,
    data: {
      title: 'Favorites List',
      seo: {
        title: 'Your Favorites',
        description: 'View and manage your favorite furniture pieces and home decor items.',
        keywords: 'favorite furniture, saved items, wishlist, furniture collection'
      }
    }
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    data: {
      title: 'Checkout',
      seo: {
        title: 'Secure Checkout',
        description: 'Complete your purchase securely with our easy checkout process.',
        keywords: 'furniture checkout, secure payment, buy furniture, complete order'
      }
    }
  },
  {
    path: 'contact',
    component: ContactUsComponent,
    data: {
      title: 'Contact Us',
      seo: {
        title: 'Contact Us',
        description: 'Get in touch with our team for inquiries, support, or to learn more about our furniture collection.',
        keywords: 'furniture store contact, customer service, support, locations, showroom'
      }
    }
  },
  { path: "**", redirectTo: 'home' }
];
