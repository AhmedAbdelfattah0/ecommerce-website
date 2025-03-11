import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { ResponsiveService } from '../../common/services/responsive.service';
import { Observable, reduce } from 'rxjs';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-header',
  imports: [BaseComponent.materialModules, MobileMenuComponent, CommonModule,
    RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @ViewChild(MobileMenuComponent) mobileMenu!: MobileMenuComponent;

  isMobile$: Observable<boolean> = new Observable<boolean>();
  // isMenuOpen = false;

  constructor(private responsiveService: ResponsiveService, private _cartService: CartService) { }
  ngOnInit(): void {
    this.isMobile$ = this.responsiveService.isMobile$;

  }

  toggleMobileMenu(): void {
     this.mobileMenu.toggleMenu();
  }

  itemsCount(){
    let  qty =0;
    qty =  this._cartService.shoppingCart().reduce((total, obj) => Number(obj?.qty) + total,0);
    return qty
  }

}
