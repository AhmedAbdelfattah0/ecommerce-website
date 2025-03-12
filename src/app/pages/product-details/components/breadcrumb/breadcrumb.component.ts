import { Component } from '@angular/core';
import { Breadcrumb } from '../../../../models/Breadcrumb';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
 breadcrumbs: Breadcrumb[] = [];

  constructor( private router: Router, private activatedRoute: ActivatedRoute) {
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
