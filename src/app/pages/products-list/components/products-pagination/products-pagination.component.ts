import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-products-pagination',
  imports: [],
  templateUrl: './products-pagination.component.html',
  styleUrl: './products-pagination.component.scss'
})
export class ProductsPaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 9;
  @Output() pageChanged = new EventEmitter<number>();

  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  ngOnChanges(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.currentPage = 1; // Reset to first page whenever inputs change
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.pageChanged.emit(this.currentPage);
  }
}
