import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  imports:[BaseComponent.materialModules,CommonModule]
})
export class MobileMenuComponent {
  // @Output() menuToggled = new EventEmitter<boolean>();
  @ViewChild('drawer') drawer!: MatDrawer;
  @Input() isMobile:any = false;
  menuItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/products', label: 'Products', icon: 'category' },
    { path: '/about', label: 'About', icon: 'info' },
    { path: '/contact', label: 'Contact', icon: 'mail' }
  ];
  constructor(private router: Router) {}


  toggleMenu(): void {
    debugger
    this.drawer.toggle();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
    this.drawer.close();
  }
}
