import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface OfferBanner {
  id: number;
  isActive: boolean;
  title: string;
  description: string;
  endDate: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-offer-banner',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './offer-banner.component.html',
  styleUrls: ['./offer-banner.component.scss'],
  animations: [
    trigger('bannerAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-100%)' }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class OfferBannerComponent implements OnInit, OnDestroy {
  activeBanner: OfferBanner | null = null;
  countdownTime: CountdownTime = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  showBanner = false;
  private timerSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBannerData().subscribe(banner => {
      if (banner) {
        this.activeBanner = banner;
        this.showBanner = true;
        this.startCountdown(new Date(this.activeBanner.endDate));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadBannerData(): Observable<OfferBanner | null> {
    return this.http.get<OfferBanner[]>('assets/data/banner-offers.json').pipe(
      map(banners => {
        // Find the first active banner
        const activeBanner = banners.find(banner => banner.isActive);
        return activeBanner || null;
      })
    );
  }

  startCountdown(endDate: Date): void {
    this.timerSubscription = interval(1000).pipe(
      startWith(0),
      map(() => {
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();

        if (diff <= 0) {
          // Offer has expired
          this.showBanner = false;
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        // Calculate remaining time
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      })
    ).subscribe(time => {
      this.countdownTime = time;
    });
  }

  closeBanner(): void {
    this.showBanner = false;
  }

  formatTimeUnit(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
