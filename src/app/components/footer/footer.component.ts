import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition, query, stagger, group } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [BaseComponent.materialModules, RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  animations: [
    // Footer container animation
    trigger('footerAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('800ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Staggered animation for footer columns
    trigger('columnAnimation', [
      transition(':enter', [
        query('.footer-column, .footer-help', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(150, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Logo animation
    trigger('logoAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.7)' }),
        animate('700ms 100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    // Links animation
    trigger('linksAnimation', [
      transition(':enter', [
        query('li', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Social icons animation
    trigger('socialAnimation', [
      transition(':enter', [
        query('li', [
          style({ opacity: 0, transform: 'scale(0)' }),
          stagger(150, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Address blocks animation
    trigger('addressAnimation', [
      transition(':enter', [
        query('.address-block', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(150, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Footer bottom copyright animation
    trigger('copyrightAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 1000ms ease-in', style({ opacity: 1 }))
      ])
    ]),

    // Hover animation for links
    trigger('linkHover', [
      state('normal', style({
        transform: 'translateX(0)',
        color: '#333'
      })),
      state('hovered', style({
        transform: 'translateX(5px)',
        color: '#B88E2F'
      })),
      transition('normal <=> hovered', animate('200ms ease-out'))
    ]),

    // Hover animation for social icons
    trigger('socialHover', [
      state('normal', style({
        transform: 'translateY(0)',
        backgroundColor: 'transparent'
      })),
      state('hovered', style({
        transform: 'translateY(-5px)',
        backgroundColor: 'rgba(184, 142, 47, 0.1)'
      })),
      transition('normal <=> hovered', animate('300ms ease-out'))
    ])
  ]
})
export class FooterComponent implements OnInit {
  // Track hover states
  linkHoverStates: { [key: string]: string } = {};
  socialHoverStates: { [key: string]: string } = {};

  ngOnInit() {
    // Initialize hover states
    ['home', 'products', 'contact'].forEach(link => {
      this.linkHoverStates[link] = 'normal';
    });

    ['facebook', 'whatsapp', 'instagram', 'tiktok'].forEach(social => {
      this.socialHoverStates[social] = 'normal';
    });
  }

  setLinkHover(link: string, isHovered: boolean) {
    this.linkHoverStates[link] = isHovered ? 'hovered' : 'normal';
  }

  setSocialHover(social: string, isHovered: boolean) {
    this.socialHoverStates[social] = isHovered ? 'hovered' : 'normal';
  }
}
