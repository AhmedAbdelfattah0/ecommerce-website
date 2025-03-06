import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  imports: [HeroComponent,CommonModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsListComponent {

}
