import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category';
import { CatigoryService } from '../../../../services/categories/categories.service';
import { RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../common/components/base/base.component';
import { NgOptimizedImage } from '@angular/common';
import { staggerFadeInUp } from '../../../../shared/animations';
import { AppearAnimateDirective } from '../../../../shared/directives/appear-animate.directive';

@Component({
  selector: 'app-categories-section',
  imports: [RouterModule, BaseComponent.materialModules, NgOptimizedImage, AppearAnimateDirective],
  templateUrl: './categories-section.component.html',
  styleUrl: './categories-section.component.scss',
  animations: [staggerFadeInUp]
})
export class CategoriesSectionComponent implements OnInit {
  categories: Category[] = [];

  constructor(private _catigoryService: CatigoryService) {}

  ngOnInit() {
    this._catigoryService.getCatigories().subscribe(res => {
      this.categories = res;
    });
  }
}
