import { Component } from '@angular/core';
import { BaseComponent } from '../../../../common/components/base/base.component';

interface Slide {
  image: string;
  number: string;      // e.g. "01 —"
  title: string;       // e.g. "Bed Room"
  subtitle: string;
  alt:string;   // e.g. "Inner Peace"
}

@Component({
  selector: 'app-rooms-inspiration',
  imports:[BaseComponent.materialModules],
  templateUrl: './rooms-inspiration.component.html',
  styleUrls: ['./rooms-inspiration.component.scss']
})
export class RoomsInspirationComponent {
  currentIndex = 0;
  slides: Slide[] = [
    {
      image: 'bedroom1.png',
      number: '01 —',
      title: 'Bed Room',
      subtitle: 'Inner Peace',
      alt:"Bed Room",
    },
    {
      image: 'bedroom2.png',
      number: '02 —',
      title: 'Living Room',
      subtitle: 'Modern Minimalist',
      alt:"Living Room",

    },
    {
      image: 'bedroom3.png',
      number: '03 —',
      title: 'Kids Room',
      subtitle: 'Colorful Joy',
      alt:"Kids Room",

    }
    // Add more slides as needed
  ];

  selectedSlide = this.slides[0]
  // Each slide is 75% width, plus a small gap, so the partial next slide is visible.
  slideWidth = 75; // percentage
  slideGap = 5;    // percentage (gap between slides)

  // Move to next slide
  nextSlide() {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this.selectedSlide=this.slides[this.currentIndex]
    }else{
      this.currentIndex = 0
      this.selectedSlide=this.slides[this.currentIndex]

    }
  }

  // Move to previous slide (optional)
  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  // Jump to a specific slide
  goToSlide(index: number) {
    this.currentIndex = index;
  }

  // The offset is the sum of each slide's width + gap times currentIndex
  get trackTransform(): string {
    const offsetPerSlide = this.slideWidth + this.slideGap;
    const offset = offsetPerSlide * this.currentIndex;
    return `translateX(-${offset}%)`;
  }
}
