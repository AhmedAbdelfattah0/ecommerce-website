import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import '@ingka/modal-webc';
import '@ingka/icon-webc';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  imports: [BaseComponent.materialModules, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MobileMenuComponent {
  // @Output() menuToggled = new EventEmitter<boolean>();
  @Input() isMobile: any = false;
  isOpen = false;
  menuItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/products', label: 'Products', icon: 'category' },
    { path: '/customize', label: 'Customize', icon: 'design_services' },
    { path: '/deals', label: 'Hot deals', icon: 'local_fire_department' },
    { path: '/contact', label: 'Contact', icon: 'mail' }
  ];
  constructor(private router: Router) { }


  toggleMenu(): void {
     this.isOpen = !this.isOpen;
  }
  closeModal(): void {
    this.isOpen = false;
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.closeModal();
  }
}
