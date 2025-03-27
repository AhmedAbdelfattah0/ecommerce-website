import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-social-gallery',
  imports: [BaseComponent.materialModules, NgOptimizedImage],
  templateUrl: './social-gallery.component.html',
  styleUrl: './social-gallery.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerFadeIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('150ms', [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  standalone: true
})
export class SocialGalleryComponent implements AfterViewInit {
  @ViewChildren('galleryItem') galleryItems!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    setTimeout(() => {
      if (this.galleryItems) {
        this.galleryItems.forEach(item => {
          observer.observe(item.nativeElement);
        });
      }
    }, 100);
  }
}
