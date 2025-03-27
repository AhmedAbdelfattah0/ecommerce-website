import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { fadeInRight, fadeInLeft, fadeInUp, zoomIn } from '../../../../shared/animations';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage, MatButtonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  animations: [fadeInRight, fadeInLeft, fadeInUp, zoomIn]
})
export class HeroComponent {
  // The hero now uses NgOptimizedImage for better performance
}
