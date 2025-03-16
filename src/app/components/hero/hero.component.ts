import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Breadcrumb } from '../../models/Breadcrumb';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterContentInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
     private router: Router,
    private activatedRoute: ActivatedRoute,

   ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumb(this.activatedRoute.root);
    });
  }

  ngAfterContentInit() {}

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    // Add "Home" only if it's not already there
    if (breadcrumbs.length === 0 && !breadcrumbs.some(b => b.url === '/home')) {
      breadcrumbs.push({ title: 'Home', url: '/home' });
    }

    if (children.length === 0) {
      return breadcrumbs;
    }

    children.forEach(child => {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      if (child.snapshot.data && child.snapshot.data['title']) {
        // Ensure we don't duplicate breadcrumbs for the same URL
        if (!breadcrumbs.some(b => b.url === nextUrl)) {
          breadcrumbs.push({
            title: child.snapshot.data['title'],
            url: nextUrl
          });
        }
      }

      // Recursively build breadcrumbs
      this.buildBreadcrumb(child, nextUrl, breadcrumbs);
    });

    return breadcrumbs;
  }
}
