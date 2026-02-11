# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Angular 19 e-commerce furniture store application called "Lugar Store" (lugarstore.net). The application is built with standalone components, uses Angular Material, and integrates INGKA Web Components for UI elements.

## Common Commands

### Development
```bash
npm start              # Start development server (http://localhost:4200)
ng serve              # Alternative command to start dev server
```

### Building
```bash
npm run build         # Production build (outputs to dist/ecommerce-website)
npm run watch         # Development build with watch mode
```

### Testing
```bash
npm test              # Run unit tests with Karma
ng test               # Alternative command for tests
```

### Code Generation
```bash
ng generate component <name>     # Generate a new component (creates .ts, .html, .scss, .spec.ts)
ng generate service <name>       # Generate a new service
ng generate --help               # See all available schematics
```

**Note**: Component generation defaults to SCSS styling and `app-` prefix (configured in `angular.json`).

## Architecture

### Application Structure

**Standalone Components**: This application uses Angular's standalone component architecture (no NgModules). All components are self-contained with explicit imports. Application providers are configured in `src/app/app.config.ts`.

**Routing**: Route-based architecture with SEO metadata defined per route in `src/app/app.routes.ts`. Each route includes `title` and `seo` data for meta tags. Router configured in `src/app/app.config.ts` with:
- `PreloadAllModules` for eager module preloading
- `scrollPositionRestoration: 'enabled'` for automatic scroll restoration
- Client-side hydration enabled

**State Management**: Uses Angular signals for reactive state management:
- `CartService` manages shopping cart and wishlist with signals
- State persisted to localStorage for cart and wishlist
- No external state management library

**API Integration**:
- Base API URL configured per environment in `src/environments/`
- Production API: `https://lugarstore.net/api`
- HTTP interceptor (`src/app/common/services/http-interceptor.interceptor.ts`) automatically prepends API URL to all requests (except `.json` files)
- Configured in `app.config.ts` via `provideHttpClient(withInterceptors([httpInterceptor]))`

### Key Services

**CartService** (`src/app/services/cart/cart.service.ts`)
- Manages shopping cart and wishlist with signals
- Persists state to localStorage
- Methods: `addToCart()`, `updateQty()`, `removeFromCart()`, `addToWishlist()`, `removeFromWishlist()`, `addAllToCart()`

**SEO Service** (`src/app/services/seo/seo.service.ts`)
- Automatically updates meta tags on route changes via `init()` method
- Sets Open Graph and Twitter Card metadata
- Domain: `https://lugarstore.net`
- Call `updateProductMetaTags(product)` for product pages with dynamic content
- Automatically manages canonical URLs
- For product pages, includes product-specific meta tags (price, currency, availability, category)

**Toaster Service** (`src/app/services/toatser.service.ts`)
- Toast notifications using INGKA toast web components
- Constants defined in `src/app/common/constants/app.constants.ts`

**ResponsiveService** (`src/app/common/services/responsive.service.ts`)
- Provides `isMobile$` observable for tracking mobile/tablet breakpoints
- Uses Angular CDK BreakpointObserver

**Other Services**:
- `ProductService` - Fetches product data from API
- `CategoriesService` - Manages product categories
- `SubCategoriesService` - Manages subcategories
- `OrderService` - Handles order creation
- `CustomizationService` - Handles custom furniture orders
- `ContactUsService` - Handles contact form submissions
- `BannerService` - Manages promotional banners

### Page Components

Main pages are in `src/app/pages/`:
- `home/` - Homepage with sub-components (hero, banner-carousel, categories-section, features-products, rooms-inspiration, social-gallery)
- `products-list/` - Product listing with filtering, pagination, and product cards
- `product-details/` - Individual product details
- `cart/` - Shopping cart
- `favorites-list/` - Wishlist/favorites
- `checkout/` - Checkout flow
- `hot-deals/` - Special offers page
- `contact-us/` - Contact form
- `order-customization/` - Custom furniture order form

### Shared Components

Located in `src/app/components/`:
- `header/` - Main navigation (sticky)
- `footer/` - Site footer
- `mobile-menu/` - Mobile navigation drawer
- `offer-banner/` - Promotional banner with countdown
- `qty-stepper/` - Quantity increment/decrement control
- `toaster/` - Toast notification component

### Models

TypeScript interfaces in `src/app/models/`:
- `product.ts` - Product data structure
- `cart.ts` - Cart item interface
- `category.ts` - Category structure
- `sub-category.ts` - Subcategory structure
- `create-order.ts` - Order creation payload
- `order-customization.ts` - Custom order data
- `pagination.model.ts` - Pagination metadata
- `Breadcrumb.ts` - Breadcrumb navigation

### Styling

- **Global styles**: `src/styles.scss`
- **Component styles**: SCSS files per component
- **Theme**: Angular Material Azure Blue theme
- **Component prefix**: `app-`

### Environment Configuration

Environment files in `src/environments/`:
- `environment.ts` - Default configuration (points to production API)
- `environment.development.ts` - Development configuration (file replacement in angular.json)
- `environment.prod.ts` / `environment.production.ts` - Production configuration

File replacement configured in `angular.json`: `environment.ts` is replaced with `environment.development.ts` during development builds. All environments currently point to production API: `https://lugarstore.net/api`.

### Animations

Custom animations defined in `src/app/shared/animations.ts`:
- Entry animations: `fadeInUp`, `fadeIn`, `fadeInRight`, `fadeInLeft`, `flipLeft`, `zoomIn`, `bounceIn`
- Scroll-triggered animations: `scrollFadeIn`, `scrollZoomIn`, `scrollFlipIn`
- Stagger animations: `staggerFadeInUp`
- Attention animations: `attention`

Used with directives:
- `appear-animate.directive.ts` - Animation on element appearance
- `intersection-observer.directive.ts` - Trigger animations on viewport intersection

### Web Components

Uses INGKA (IKEA) design system web components:
- `@ingka/card-webc` - Card components
- `@ingka/icon-webc` - Icon library
- `@ingka/modal-webc` - Modal dialogs
- `@ingka/skeleton-webc` - Loading skeletons
- `@ingka/toast-webc` - Toast notifications
- `@ingka/aspect-ratio-box-webc` - Aspect ratio containers

These are imported as custom elements in relevant components.

### Important Patterns

**Base Component**: `src/app/common/components/base/base.component.ts` provides a base class for component lifecycle management. Extend this for components that need cleanup.

**HTTP Interceptor**: All HTTP requests (except `.json` files) are automatically prefixed with the API URL from environment configuration. This means service methods should use relative URLs (e.g., `/products` not `https://lugarstore.net/api/products`).

**Local Storage**: Cart and wishlist are persisted automatically. No manual save/load needed when using CartService methods.

**SEO**: Route-level SEO metadata is automatically applied. For dynamic content (like product details), explicitly call `seoService.updateProductMetaTags(product)`.

**Contact**: The application uses WhatsApp for customer contact. WhatsApp links and phone numbers are integrated in the contact page and header.

## Build Configuration

- **Output**: `dist/ecommerce-website`
- **Budget Limits**:
  - Initial bundle: 1MB warning, 2MB error
  - Component styles: 1MB warning, 2MB error
- **Preloading**: All lazy-loaded modules are preloaded via `PreloadAllModules`
- **Service Worker**: PWA manifest is included in `public/manifest.webmanifest`
