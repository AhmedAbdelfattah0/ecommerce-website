import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { SeoService } from './services/seo/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ecommerce-website';

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    // Initialize SEO service to handle route changes
    this.seoService.init();
  }
}
