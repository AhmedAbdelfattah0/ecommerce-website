import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../common/components/base/base.component';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports:[BaseComponent.materialModules,CommonModule,HeroComponent]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
