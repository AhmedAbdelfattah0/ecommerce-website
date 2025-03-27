import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { trigger, state, style, animate, transition, query, stagger, group } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [BaseComponent.materialModules, CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
  animations: [
    // Animation for the entire features section
    trigger('featuresAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-out', style({ opacity: 1 }))
      ])
    ]),

    // Animation for staggered entry of feature items
    trigger('featureItemsAnimation', [
      transition(':enter', [
        query('.feature-item', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(150, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Animation for feature icons
    trigger('iconAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('500ms 300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    // Animation for feature text
    trigger('textAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms 400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Hover animation for feature items
    trigger('featureHover', [
      state('normal', style({
        transform: 'translateY(0)',
        boxShadow: 'none',
        backgroundColor: '#F9F1E7'
      })),
      state('hovered', style({
        transform: 'translateY(-10px)',
        boxShadow: '0 10px 25px rgba(184, 142, 47, 0.15)',
        backgroundColor: '#ffffff'
      })),
      transition('normal <=> hovered', animate('300ms ease-out'))
    ])
  ]
})
export class FeaturesComponent implements OnInit {
  // Track hover state for each feature
  featureHoverStates: string[] = ['normal', 'normal', 'normal', 'normal'];

  constructor() {}

  ngOnInit() {
    // Add icon pulse animation after initial load
    setTimeout(() => {
      this.startIconAnimations();
    }, 2000);
  }

  // Methods to handle hover states
  setHoverState(index: number, isHovered: boolean) {
    this.featureHoverStates[index] = isHovered ? 'hovered' : 'normal';
  }

  // This method would add the pulse animation to icons periodically
  // In a real implementation, you would target the DOM elements directly
  startIconAnimations() {
    // This is a placeholder - in a real implementation you would use
    // Renderer2 or ViewChildren to apply CSS animations to the elements
    console.log('Starting periodic icon animations');
  }
}
