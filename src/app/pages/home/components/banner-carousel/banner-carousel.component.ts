import { Component, OnInit, OnDestroy, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, HostListener, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { BannerService, Banner } from '../../../../services/banner/banner.service';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { RouterLink } from '@angular/router';

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
export class BannerCarouselComponent implements OnInit, OnDestroy {
  banners: Banner[] = [];
  currentIndex = signal<number>(0);
  loading = true;
  error = false;
  autoplayInterval: any;
  private destroy$ = new Subject<void>();
  touchStartX = 0;

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.loadBanners();
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAutoplay();
  }

  loadBanners(): void {
    this.loading = true;
    this.bannerService.getBanners()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.banners = data;
          this.loading = false;

          // Handle empty banners case
          if (this.banners.length === 0) {
            this.error = true;
          }
        },
        error: (err) => {
          console.error('Error loading banners:', err);
          this.loading = false;
          this.error = true;
        }
      });
  }

  prevSlide(): void {
    if (this.banners.length === 0) return;

    this.stopAutoplay();
    this.currentIndex.update(current =>
      current === 0 ? this.banners.length - 1 : current - 1
    );
    this.startAutoplay();
  }

  nextSlide(): void {
    if (this.banners.length === 0) return;

    this.stopAutoplay();
    this.currentIndex.update(current =>
      current === this.banners.length - 1 ? 0 : current + 1
    );
    this.startAutoplay();
  }

  goToSlide(index: number): void {
    if (this.banners.length === 0) return;

    this.stopAutoplay();
    this.currentIndex.set(index);
    this.startAutoplay();
  }

  startAutoplay(): void {
    if (this.banners.length <= 1) return;

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

    // If the swipe is significant enough (more than 50px)
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe right - show previous slide
        this.prevSlide();
      } else {
        // Swipe left - show next slide
        this.nextSlide();
      }
    }
  }
}
