import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAppearAnimate]',
  standalone: true
})
export class AppearAnimateDirective implements OnInit, OnDestroy {
  @Input() animationDelay: number = 0;
  @Input() animationClass: string = 'animate';
  @Input() threshold: number = 0.1;
  @Input() rootMargin: string = '0px';
  @Input() animateOnce: boolean = true;

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    this.cleanupObserver();
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class when element enters viewport
          setTimeout(() => {
            this.renderer.addClass(this.el.nativeElement, this.animationClass);
          }, this.animationDelay);

          // If animate once is true, stop observing after animation is applied
          if (this.animateOnce) {
            this.observer?.unobserve(entry.target);
          }
        } else if (!this.animateOnce) {
          // If we're set to animate multiple times, remove the class when out of view
          this.renderer.removeClass(this.el.nativeElement, this.animationClass);
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  private cleanupObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
