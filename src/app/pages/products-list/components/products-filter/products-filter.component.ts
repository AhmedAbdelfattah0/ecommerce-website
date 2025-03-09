import { Catigory } from './../../../../models/catigory';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatigoryService } from '../../../../services/catigries/catigory.service';

@Component({
  selector: 'app-products-filter',
  imports: [BaseComponent.materialModules,CommonModule,FormsModule],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss'
})
export class ProductsFilterComponent {
  @Input() startIndex  : number = 1;
  @Input() endIndex  : number = 1;
  @Input() totalItems  : number = 1;


 // Example: total item count
  @Output() filterChanged = new EventEmitter<any>();
  @Output() itemsPerPageChanged = new EventEmitter<any>();
  @Output() sortChanged = new EventEmitter<string>();
  @Output() viewModeChanged = new EventEmitter<'grid' | 'list'>();

  catigoriesList: Catigory[] = [];

  constructor( private _catigoryService:CatigoryService ){
    this._catigoryService.getCatigories().subscribe(res=>{
      this.catigoriesList = res;
    })
  }
  viewMode: 'grid' | 'list' = 'list';

  ngOnInit(): void {}

  onFilterClick(catigoryId:any): void {
     this.filterChanged.emit(catigoryId);
  }
  onItemsPerPageClicked(event:Event): void {
    const select = event.target as HTMLSelectElement;

    // Trigger filter logic
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
}
