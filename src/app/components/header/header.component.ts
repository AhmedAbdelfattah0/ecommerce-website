import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { ResponsiveService } from '../../common/services/responsive.service';
import { Observable } from 'rxjs';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

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

  constructor(private responsiveService: ResponsiveService) { }
  ngOnInit(): void {
    this.isMobile$ = this.responsiveService.isMobile$;

  }

  toggleMobileMenu(): void {
    debugger
    this.mobileMenu.toggleMenu();
  }


}
