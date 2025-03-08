import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-filter',
  imports: [BaseComponent.materialModules,CommonModule,FormsModule],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss'
})
export class ProductsFilterComponent {
  @Input() itemsCount: number = 12; // Example: total item count
  @Output() filterChanged = new EventEmitter<any>();
  @Output() sortChanged = new EventEmitter<string>();
  @Output() viewModeChanged = new EventEmitter<'grid' | 'list'>();

  viewMode: 'grid' | 'list' = 'list';

  ngOnInit(): void {}

  onFilterClick(): void {
    // Trigger filter logic
    this.filterChanged.emit({/* filter data */});
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortChanged.emit(select.value);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
    this.viewModeChanged.emit(mode);
  }
}
