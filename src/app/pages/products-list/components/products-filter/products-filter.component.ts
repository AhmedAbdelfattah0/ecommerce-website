import { Category } from '../../../../models/category';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatigoryService } from '../../../../services/categories/categories.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
  keyframes
} from '@angular/animations';

@Component({
  selector: 'app-products-filter',
  standalone: true,
  imports: [BaseComponent.materialModules, CommonModule, FormsModule],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss',
  animations: [
    // Container animation
    trigger('filterContainerAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Filter button animation
    trigger('filterButtonAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    // View mode icons animation
    trigger('viewModeAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('300ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Active view mode animation
    trigger('activeViewMode', [
      state('active', style({
        backgroundColor: 'rgba(184, 142, 47, 0.2)',
        transform: 'scale(1.1)'
      })),
      state('inactive', style({
        backgroundColor: 'transparent',
        transform: 'scale(1)'
      })),
      transition('inactive <=> active', animate('200ms ease-in-out'))
    ]),

    // Results count animation
    trigger('resultsAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 300ms ease-out', style({ opacity: 1 }))
      ]),
      transition('* => *', [
        style({ opacity: 0.5, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),

    // Form controls animation
    trigger('formControlsAnimation', [
      transition(':enter', [
        query('select, label', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Dropdown animation
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0.8)', transformOrigin: 'top' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scaleY(1)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scaleY(1)', transformOrigin: 'top' }),
        animate('200ms ease-in', style({ opacity: 0, transform: 'scaleY(0.8)' }))
      ])
    ]),

    // Hover animation for icons
    trigger('iconHover', [
      state('hovered', style({
        transform: 'scale(1.2)',
        color: '#B88E2F'
      })),
      state('normal', style({
        transform: 'scale(1)',
        color: '#000'
      })),
      transition('normal <=> hovered', animate('200ms ease-out'))
    ])
  ]
})
export class ProductsFilterComponent {
  @Input() startIndex: number = 1;
  @Input() endIndex: number = 1;
  @Input() totalItems: number = 1;

  @Output() filterChanged = new EventEmitter<any>();
  @Output() itemsPerPageChanged = new EventEmitter<any>();
  @Output() sortChanged = new EventEmitter<string>();
  @Output() viewModeChanged = new EventEmitter<'grid' | 'list'>();

  catigoriesList: Category[] = [];
  viewMode: 'grid' | 'list' = 'list';
  filterIconState: 'normal' | 'hovered' = 'normal';
  gridIconState: 'normal' | 'hovered' = 'normal';
  listIconState: 'normal' | 'hovered' = 'normal';

  // Track previous values for animations
  private previousStartIndex = 1;
  private previousEndIndex = 1;
  private previousTotalItems = 1;

  constructor(private _catigoryService: CatigoryService) {
    this._catigoryService.getCatigories().subscribe(res => {
      this.catigoriesList = res;
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    // Track changes for animation
    this.previousStartIndex = this.startIndex;
    this.previousEndIndex = this.endIndex;
    this.previousTotalItems = this.totalItems;
  }

  onFilterClick(catigoryId: any): void {
    this.filterChanged.emit(catigoryId);
  }

  onItemsPerPageClicked(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPageChanged.emit(Number(select.value));
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortChanged.emit(select.value);
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
    this.viewModeChanged.emit(mode);
  }

  // Methods for handling icon hover states
  setIconState(icon: 'filter' | 'grid' | 'list', state: 'normal' | 'hovered'): void {
    switch (icon) {
      case 'filter':
        this.filterIconState = state;
        break;
      case 'grid':
        this.gridIconState = state;
        break;
      case 'list':
        this.listIconState = state;
        break;
    }
  }

  // Get animation state for view mode icons
  getViewModeState(mode: 'grid' | 'list'): string {
    return this.viewMode === mode ? 'active' : 'inactive';
  }
}
