import { Component } from '@angular/core';
import { Category } from '../../../../models/category';
import { CatigoryService } from '../../../../services/categories/categories.service';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../common/components/base/base.component';

@Component({
  selector: 'app-categories-section',
  imports: [RouterModule, BaseComponent.materialModules],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.scss'
})
export class CategoriesSectionComponent {
  categories: Category[] = [];
   constructor( private _catigoryService:CatigoryService ){
      this._catigoryService.getCatigories().subscribe(res=>{
        this.categories = res;
      })
    }
}
