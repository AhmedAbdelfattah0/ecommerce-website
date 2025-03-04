import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../common/components/base/base.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  imports:[BaseComponent.materialModules,CommonModule]
})
export class MobileMenuComponent {
  @Output() closed = new EventEmitter<void>();
  @Input() isOpen = false;
  @Output() menuItemClicked = new EventEmitter<string>();

  menuItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/products', label: 'Products', icon: 'category' },
    { path: '/about', label: 'About', icon: 'info' },
    { path: '/contact', label: 'Contact', icon: 'mail' }
  ];
  constructor(private router: Router) {}

  // toggleMenu(state: boolean): void {
  //   debugger
  //   this.isOpen = state;
  // }
  handleNavigation(path: string) {
    this.menuItemClicked.emit(path);
  }
  closeMenu(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.closeMenu();
  }
}
