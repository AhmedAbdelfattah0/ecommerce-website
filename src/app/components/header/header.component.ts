import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { ResponsiveService } from '../../common/services/responsive.service';
import { Observable, reduce } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CartService } from '../../services/cart/cart.service';
import { CatigoryService } from '../../services/categories/categories.service';
import { Category } from '../../models/category';
import { trigger, state, style, animate, transition, query, stagger, animateChild, group, keyframes } from '@angular/animations';

@Component({
  selector: 'app-header',
  imports: [BaseComponent.materialModules, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    // Animation for the entire header
    trigger('headerAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'translateY(0)' }))
      ])
    ]),

    // Animation for the logo
    trigger('logoAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('500ms 100ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    // Animation for the nav links with staggered effect
    trigger('navLinksAnimation', [
      transition(':enter', [
        query('.nav-link', [
          style({ opacity: 0, transform: 'translateY(-15px)' }),
          stagger(80, [
            animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Animation for header actions
    trigger('actionsAnimation', [
      transition(':enter', [
        query('button', [
          style({ opacity: 0, transform: 'translateX(20px)' }),
          stagger(100, [
            animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Enhanced animation for cart count changes
    trigger('cartCountAnimation', [
      transition(':increment, :decrement', [
        animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.5)', backgroundColor: '#E97171', offset: 0.3 }),
          style({ transform: 'scale(1)', backgroundColor: '*', offset: 1.0 })
        ]))
      ])
    ]),

    // Hover animation for icons
    trigger('iconHover', [
      state('default', style({
        transform: 'scale(1)'
      })),
      state('hovered', style({
        transform: 'scale(1.2)',
        color: '#B88E2F'
      })),
      transition('default <=> hovered', [
        animate('300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {
  @ViewChild('matToolbar', { static: true }) matToolbar!: ElementRef;
  @Output() menuToggle = new EventEmitter<void>();

  isMobile$: Observable<boolean> = new Observable<boolean>();
  previousCount = 0;
  isScrolled: boolean = false;

  // Track hover states for icons
  favoriteHover = 'default';
  cartHover = 'default';

  // Categories and dropdown state
  categories: Category[] = [];
  showProductsDropdown: boolean = false;

  constructor(
    private responsiveService: ResponsiveService,
    private _cartService: CartService,
    private _categoryService: CatigoryService,
    public router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.isMobile$ = this.responsiveService.isMobile$;
    this.previousCount = this.itemsCount();
    this.loadCategories();
  }

  loadCategories(): void {
    this._categoryService.getCatigories().subscribe(categories => {
      this.categories = categories;
    });
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
    this.menuToggle.emit();
  }

  itemsCount(){
    let qty = 0;
    qty = this._cartService.shoppingCart().reduce((total, obj) => Number(obj?.qty) + total, 0);
    this.previousCount = qty;
    return qty;
  }

  // Methods to handle icon hover states
  onFavoriteMouseEnter() {
    this.favoriteHover = 'hovered';
  }

  onFavoriteMouseLeave() {
    this.favoriteHover = 'default';
  }

  onCartMouseEnter() {
    this.cartHover = 'hovered';
  }

  onCartMouseLeave() {
    this.cartHover = 'default';
  }

  // Products dropdown methods
  toggleProductsDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showProductsDropdown = !this.showProductsDropdown;
  }

  navigateToCategory(categoryId: number): void {
    if (categoryId === 0) {
      // Navigate to all products (no filter)
      this.router.navigate(['/products']);
    } else {
      // Navigate to filtered products by category
      this.router.navigate(['/products'], { queryParams: { pros: categoryId } });
    }
    this.showProductsDropdown = false;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = this.el.nativeElement.querySelector('.nav-link-wrapper')?.contains(target);

    if (!clickedInside && this.showProductsDropdown) {
      this.showProductsDropdown = false;
    }
  }
}
