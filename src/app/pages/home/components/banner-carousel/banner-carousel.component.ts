import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, HostListener, signal, AfterViewInit } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { BannerService, Banner } from '../../../../services/banner/banner.service';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-banner-carousel',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './banner-carousel.component.html',
  styleUrl: './banner-carousel.component.scss',
  animations: [
    trigger('fadeAnimation', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-in')
      ]),
      transition(':leave', [
        animate('600ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class BannerCarouselComponent implements OnInit, OnDestroy, AfterViewInit {
  banners: Banner[] = [];
  currentIndex = signal<number>(0);
  loading = true;
  error = false;
  autoplayInterval: any;
  private destroy$ = new Subject<void>();
  touchStartX = 0;
  private screenWidth: number = 0;
  private isMobile: boolean = false;
  private isExtraSmallDevice: boolean = false;

  constructor(
    private bannerService: BannerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      this.isMobile = this.screenWidth < 576;
      this.isExtraSmallDevice = this.screenWidth <= 375;
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      this.isMobile = this.screenWidth < 576;
      this.isExtraSmallDevice = this.screenWidth <= 375;
      this.loadBanners();
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAutoplay();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
      this.isMobile = this.screenWidth < 576;
      this.isExtraSmallDevice = this.screenWidth <= 375;

      this.updateImageSizing();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.updateImageSizing();
      }, 0);
    }
  }

  private updateImageSizing(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const bannerImages = this.document.querySelectorAll('.banner-image') as NodeListOf<HTMLImageElement>;

    bannerImages.forEach(img => {
      if (this.isExtraSmallDevice) {
        img.style.objectPosition = 'center 25%';
      } else if (this.isMobile) {
        img.style.objectPosition = 'center top';
      } else {
        img.style.objectPosition = 'center';
      }
    });
  }

  loadBanners(): void {
    this.loading = true;
    this.bannerService.getBanners()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.banners = data;
          this.loading = false;

          if (this.banners.length === 0) {
            this.error = true;
          }

          this.preloadNextImage();

          if (isPlatformBrowser(this.platformId) && this.banners.length > 0) {
            setTimeout(() => {
              this.updateImageSizing();
            }, 100);
          }
        },
        error: (err) => {
          console.error('Error loading banners:', err);
          this.loading = false;
          this.error = true;
        }
      });
  }

  preloadNextImage(): void {
    if (!isPlatformBrowser(this.platformId) || this.banners.length <= 1) return;

    const nextIndex = (this.currentIndex() + 1) % this.banners.length;
    const img = new Image();
    img.src = this.banners[nextIndex].image_url;
  }

  prevSlide(): void {
    if (this.banners.length === 0) return;

    this.stopAutoplay();
    this.currentIndex.update(current =>
      current === 0 ? this.banners.length - 1 : current - 1
    );
    this.preloadNextImage();
    this.startAutoplay();
  }

  nextSlide(): void {
    if (this.banners.length === 0) return;

    this.stopAutoplay();
    this.currentIndex.update(current =>
      current === this.banners.length - 1 ? 0 : current + 1
    );
    this.preloadNextImage();
    this.startAutoplay();
  }

  goToSlide(index: number): void {
    if (this.banners.length === 0) return;

    this.stopAutoplay();
    this.currentIndex.set(index);
    this.preloadNextImage();
    this.startAutoplay();

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.updateImageSizing();
      }, 50);
    }
  }

  startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId) || this.banners.length <= 1) return;

    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].clientX;
    const diffX = touchEndX - this.touchStartX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        this.prevSlide();
      } else {
        this.nextSlide();
      }
    }
  }
}
