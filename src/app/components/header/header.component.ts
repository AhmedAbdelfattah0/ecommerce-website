import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { ResponsiveService } from '../../common/services/responsive.service';
import { Observable, reduce } from 'rxjs';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CartService } from '../../services/cart/cart.service';
import { trigger, state, style, animate, transition, query, stagger, animateChild, group } from '@angular/animations';

@Component({
  selector: 'app-header',
  imports: [BaseComponent.materialModules, MobileMenuComponent, CommonModule,
    RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    // Animation for the entire header
    trigger('headerAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('400ms ease-out', style({ transform: 'translateY(0)' }))
      ])
    ]),

    // Animation for the logo
    trigger('logoAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms 200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    // Animation for the nav links with staggered effect
    trigger('navLinksAnimation', [
      transition(':enter', [
        query('.nav-link', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Animation for header actions
    trigger('actionsAnimation', [
      transition(':enter', [
        query('button', [
          style({ opacity: 0, transform: 'scale(0)' }),
          stagger(150, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Animation for hover on cart count
    trigger('cartCountAnimation', [
      transition(':increment, :decrement', [
        style({ transform: 'scale(1.5)', backgroundColor: '#E97171' }),
        animate('300ms', style({ transform: 'scale(1)', backgroundColor: '*' }))
      ])
    ]),

    // Animation for active route indicator
    trigger('activeRouteAnimation', [
      state('active', style({
        borderBottom: '2px solid #B88E2F',
        fontWeight: 'bold'
      })),
      state('inactive', style({
        borderBottom: 'none',
        fontWeight: 'normal'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  @ViewChild(MobileMenuComponent) mobileMenu!: MobileMenuComponent;
  @ViewChild('matToolbar', { static: true }) matToolbar!: ElementRef;

  isMobile$: Observable<boolean> = new Observable<boolean>();
  previousCount = 0;
  isScrolled: boolean = false;

  constructor(
    private responsiveService: ResponsiveService,
    private _cartService: CartService,
    public router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }
  ngOnInit(): void {
    this.isMobile$ = this.responsiveService.isMobile$;
    this.previousCount = this.itemsCount();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollTop > 50) {
      this.renderer.addClass(this.el.nativeElement.querySelector('.header-container'), 'header-scrolled');
      this.isScrolled = true;
    } else {
      this.renderer.removeClass(this.el.nativeElement.querySelector('.header-container'), 'header-scrolled');
      this.isScrolled = false;
    }
  }

  toggleMobileMenu(): void {
     this.mobileMenu.toggleMenu();
  }

  itemsCount(){
    let qty = 0;
    qty = this._cartService.shoppingCart().reduce((total, obj) => Number(obj?.qty) + total, 0);
    this.previousCount = qty;
    return qty;
  }
}
