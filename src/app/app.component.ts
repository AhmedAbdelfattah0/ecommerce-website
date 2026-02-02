import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { OfferBannerComponent } from './components/offer-banner/offer-banner.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { SeoService } from './services/seo/seo.service';
import { ResponsiveService } from './common/services/responsive.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToasterComponent, OfferBannerComponent, MobileMenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ecommerce-website';
  isMobile$: Observable<boolean>;

  @ViewChild(MobileMenuComponent) mobileMenu!: MobileMenuComponent;

  constructor(
    private seoService: SeoService,
    private responsiveService: ResponsiveService
  ) {
    this.isMobile$ = this.responsiveService.isMobile$;
  }

  ngOnInit() {
    // Initialize SEO service to handle route changes
    this.seoService.init();
  }

  toggleMobileMenu() {
    if (this.mobileMenu) {
      this.mobileMenu.toggleMenu();
    }
  }
}
