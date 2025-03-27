import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
  standalone: true
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() threshold: number = 0.1;
  @Input() rootMargin: string = '0px';
  @Input() root: HTMLElement | null = null;
  @Output() appIntersectionObserver = new EventEmitter<boolean>();

  private observer: IntersectionObserver | null = null;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.createObserver();
  }

  ngOnDestroy() {
    this.destroyObserver();
  }

  private createObserver() {
    const options = {
      root: this.root,
      rootMargin: this.rootMargin,
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.appIntersectionObserver.emit(entry.isIntersecting);
      });
    }, options);

    this.observer.observe(this.element.nativeElement);
  }

  private destroyObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
