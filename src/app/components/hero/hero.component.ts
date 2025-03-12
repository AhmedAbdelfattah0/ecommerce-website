import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Breadcrumb } from '../../models/Breadcrumb';
 @Component({
  selector: 'app-hero',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterContentInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private zone: NgZone,private router: Router, private activatedRoute: ActivatedRoute,  private cdr: ChangeDetectorRef) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = [...this.buildBreadcrumb(this.activatedRoute.root)];
  });
  }

  ngAfterContentInit () {

  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<{ title: string; url: string }> = []
  ): Array<{ title: string; url: string }> {
    // If we’re at the root and breadcrumbs are empty, add Home
    if (breadcrumbs.length === 0) {
      breadcrumbs.push({
        title: 'Home',
        url: '/home'
      });
    }

    // Get child routes
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    children.forEach(child => {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      if (child.snapshot.data && child.snapshot.data['title']) {
        breadcrumbs.push({
          title: child.snapshot.data['title'],
          url: nextUrl
        });
      }

      // Recursively process further children
      this.buildBreadcrumb(child, nextUrl, breadcrumbs);
    });

    return breadcrumbs;
  }

}
