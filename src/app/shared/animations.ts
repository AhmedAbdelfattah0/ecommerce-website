import { trigger, transition, style, animate, query, stagger, state, keyframes } from '@angular/animations';

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms ease-out', style({ opacity: 1 }))
  ])
]);

export const fadeInRight = trigger('fadeInRight', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(-20px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

export const fadeInLeft = trigger('fadeInLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(20px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
  ])
]);

export const flipLeft = trigger('flipLeft', [
  transition(':enter', [
    style({ opacity: 0, transform: 'rotateY(-90deg)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'rotateY(0)' }))
  ])
]);

export const zoomIn = trigger('zoomIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.9)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

export const staggerFadeInUp = trigger('staggerFadeInUp', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('100ms', [
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

export const bounceIn = trigger('bounceIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.3)' }),
    animate('300ms ease-in', style({ opacity: 0.5, transform: 'scale(1.1)' })),
    animate('150ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

// Additional scroll-triggered animations
export const scrollFadeIn = trigger('scrollFadeIn', [
  state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
  state('hidden', style({ opacity: 0, transform: 'translateY(20px)' })),
  transition('hidden => visible', [
    animate('600ms ease-out')
  ])
]);

export const scrollZoomIn = trigger('scrollZoomIn', [
  state('visible', style({ opacity: 1, transform: 'scale(1)' })),
  state('hidden', style({ opacity: 0, transform: 'scale(0.8)' })),
  transition('hidden => visible', [
    animate('600ms ease-out')
  ])
]);

export const scrollFlipIn = trigger('scrollFlipIn', [
  state('visible', style({ opacity: 1, transform: 'rotateY(0)' })),
  state('hidden', style({ opacity: 0, transform: 'rotateY(-90deg)' })),
  transition('hidden => visible', [
    animate('600ms ease-out')
  ])
]);

export const attention = trigger('attention', [
  transition('* => *', [
    animate('600ms', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.1)', offset: 0.3 }),
      style({ transform: 'scale(1)', offset: 1.0 })
    ]))
  ])
]);
