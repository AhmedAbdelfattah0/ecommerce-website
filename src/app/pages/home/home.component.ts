 import { RoomsInspirationComponent } from './components/rooms-inspiration/rooms-inspiration.component';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { SocialGalleryComponent } from './components/social-gallery/social-gallery.component';
import { CategoriesSectionComponent } from './components/categories-section/categories-section.component';
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';
  import { FeaturesProductsComponent } from './components/features-products/features-products.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    BaseComponent.materialModules,
    HeroComponent,
    SocialGalleryComponent,
    RoomsInspirationComponent,
    CategoriesSectionComponent,
    BannerCarouselComponent,
     FeaturesProductsComponent
  ]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}
