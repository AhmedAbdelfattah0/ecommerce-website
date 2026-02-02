import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly siteName = 'Lugar Store';
  private readonly defaultDescription = 'Lugar Store offers premium furniture and home decor products with elegant designs for modern homes.';
  private readonly defaultKeywords = 'furniture, home decor, interior design, Lugar Store, premium furniture';
  private readonly defaultImage = 'https://lugarstore.net/uploads/LOGO1-lugar.svg';
  private readonly baseUrl = 'https://lugarstore.net';

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Initialize SEO service to listen for route changes
   */
  init() {
    try {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data)
      ).subscribe(data => {
        try {
          const seoData = data['seo'] || {};
          this.updateMetaTags({
            title: seoData.title || data['title'] || this.siteName,
            description: seoData.description || this.defaultDescription,
            keywords: seoData.keywords || this.defaultKeywords,
            image: seoData.image || this.defaultImage,
            url: this.getFullUrl()
          });
        } catch (error) {
          console.error('Error updating SEO metadata:', error);
        }
      });
    } catch (error) {
      console.error('Error initializing SEO service:', error);
    }
  }

  /**
   * Update all meta tags for a page
   */
  updateMetaTags(config: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
  }) {
    try {
      const title = config.title ? `${config.title} | ${this.siteName}` : this.siteName;
      const description = config.description || this.defaultDescription;
      const image = config.image || this.defaultImage;
      const url = config.url || this.getFullUrl();
      const type = config.type || 'website';
      const keywords = config.keywords || this.defaultKeywords;

      // Basic meta tags
      this.title.setTitle(title);
      this.updateTag('description', description);
      this.updateTag('keywords', keywords);
      this.updateTag('robots', 'index, follow');

      // Open Graph meta tags
      this.updateTag('og:title', title, true);
      this.updateTag('og:description', description, true);
      this.updateTag('og:url', url, true);
      this.updateTag('og:image', image, true);
      this.updateTag('og:type', type, true);
      this.updateTag('og:site_name', this.siteName, true);

      // Twitter meta tags
      this.updateTag('twitter:card', 'summary_large_image');
      this.updateTag('twitter:title', title);
      this.updateTag('twitter:description', description);
      this.updateTag('twitter:image', image);

      // Canonical URL
      this.updateCanonicalUrl(url);
    } catch (error) {
      console.error('Error in updateMetaTags:', error);
    }
  }

  /**
   * Helper method to safely update meta tags
   */
  private updateTag(name: string, content: string, isProperty: boolean = false) {
    try {
      const attr = isProperty ? 'property' : 'name';
      this.meta.updateTag({ [attr]: name, content });
    } catch (error) {
      console.error(`Error updating meta tag ${name}:`, error);
    }
  }

  /**
   * Update meta tags for a product page
   */
  updateProductMetaTags(product: any) {
    if (!product) return;

    try {
      const title = product.title || product.name;
      const description = product.description || `${title} - ${this.defaultDescription}`;
      const image = product.image || product.thumbnail || this.defaultImage;
      const url = this.getFullUrl();

      this.updateMetaTags({
        title: title,
        description: description,
        image: image,
        url: url,
        type: 'product'
      });

      // Add product-specific meta tags
      if (product.price) {
        this.updateTag('product:price:amount', product.price.toString(), true);
        this.updateTag('product:price:currency', 'EGP', true);
      }

      if (product.availability) {
        this.updateTag('product:availability', product.availability, true);
      }

      if (product.categoryName) {
        this.updateTag('product:category', product.categoryName, true);
      }
    } catch (error) {
      console.error('Error in updateProductMetaTags:', error);
    }
  }

  /**
   * Set canonical URL in head
   */
  private updateCanonicalUrl(url: string) {
    try {
      // Fix the invalid selector - look for canonical link directly in the DOM
      const existingCanonicalLinks = document.querySelectorAll('link[rel="canonical"]');

      // Remove any existing canonical links
      existingCanonicalLinks.forEach(element => {
        try {
          document.head.removeChild(element);
        } catch (e) {
          console.warn('Could not remove canonical link:', e);
        }
      });

      // Create and add the new canonical link
      const link: HTMLLinkElement = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    } catch (error) {
      console.error('Error updating canonical URL:', error);
    }
  }

  /**
   * Get current full URL
   */
  private getFullUrl(): string {
    try {
      return `${this.baseUrl}${this.router.url}`;
    } catch (error) {
      console.error('Error getting full URL:', error);
      return this.baseUrl;
    }
  }
}
