import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { CatigoryService } from '../../services/categories/categories.service';
import { Category } from '../../models/category';
import '@ingka/modal-webc';
import '@ingka/icon-webc';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
  imports: [BaseComponent.materialModules, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MobileMenuComponent implements OnInit {
  // @Output() menuToggled = new EventEmitter<boolean>();
  @Input() isMobile: any = false;
  isOpen = false;
  showCategoriesSubmenu = false;
  categories: Category[] = [];
  menuItems = [
    { path: '/', label: 'Home', icon: 'home', hasSubmenu: false },
    { path: '/products', label: 'Products', icon: 'category', hasSubmenu: true },
    { path: '/customize', label: 'Customize', icon: 'design_services', hasSubmenu: false },
    { path: '/deals', label: 'Hot deals', icon: 'local_fire_department', hasSubmenu: false },
    { path: '/contact', label: 'Contact', icon: 'mail', hasSubmenu: false }
  ];
  constructor(
    private router: Router,
    private _categoryService: CatigoryService
  ) { }


  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this._categoryService.getCatigories().subscribe(categories => {
      this.categories = categories;
    });
  }

  toggleMenu(): void {
     this.isOpen = !this.isOpen;
  }

  closeModal(): void {
    this.isOpen = false;
    this.showCategoriesSubmenu = false;
  }

  toggleCategoriesSubmenu(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showCategoriesSubmenu = !this.showCategoriesSubmenu;
    console.log('Submenu toggled:', this.showCategoriesSubmenu);
  }

  navigate(path: string, hasSubmenu: boolean = false): void {
    if (hasSubmenu) {
      this.toggleCategoriesSubmenu();
    } else {
      this.router.navigate([path]);
      this.closeModal();
    }
  }

  navigateToCategory(categoryId: number): void {
    if (categoryId === 0) {
      // Navigate to all products (no filter)
      this.router.navigate(['/products']);
    } else {
      // Navigate to filtered products by category
      this.router.navigate(['/products'], { queryParams: { pros: categoryId } });
    }
    this.closeModal();
  }
}
