import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductService } from '../product/product.service';
import { CatigoryService } from '../categories/categories.service';

@Injectable({
  providedIn: 'root'
})
export class SitemapGeneratorService {
  private baseUrl = 'https://lugarstore.net';

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private categoryService: CatigoryService
  ) {}

  /**
   * Generate a sitemap XML string for the application
   */
  generateSitemap(): Observable<string> {
    // Combine static pages with dynamic product pages
    return this.getProductUrls().pipe(
      map(productUrls => {
        const staticUrls = this.getStaticUrls();
        return this.createSitemapXml([...staticUrls, ...productUrls]);
      })
    );
  }

  /**
   * Get URLs for all products
   */
  private getProductUrls(): Observable<SitemapUrl[]> {
    return this.productService.getProducts().pipe(
      map((products: any[]) => {
        return products.map(product => ({
          loc: `${this.baseUrl}/products/details/${product.id}`,
          lastmod: this.formatDate(new Date()),
          changefreq: 'weekly',
          priority: 0.8
        }));
      })
    );
  }

  /**
   * Get static URLs (main pages)
   */
  private getStaticUrls(): SitemapUrl[] {
    return [
      {
        loc: `${this.baseUrl}/home`,
        lastmod: this.formatDate(new Date()),
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        loc: `${this.baseUrl}/products`,
        lastmod: this.formatDate(new Date()),
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: `${this.baseUrl}/deals`,
        lastmod: this.formatDate(new Date()),
        changefreq: 'daily',
        priority: 0.9
      },
      {
        loc: `${this.baseUrl}/contact`,
        lastmod: this.formatDate(new Date()),
        changefreq: 'monthly',
        priority: 0.7
      }
    ];
  }

  /**
   * Create sitemap XML from URL objects
   */
  private createSitemapXml(urls: SitemapUrl[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${url.loc}</loc>\n`;
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      xml += `    <priority>${url.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Format date for sitemap (YYYY-MM-DD)
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}
