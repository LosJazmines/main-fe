import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import e from 'express';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  filter: string | null = null; // Para mostrar el filtro

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribirse a cambios de la ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        console.log({event: this.router.url});
        
        this.breadcrumbs = this.createBreadcrumbs(this.route.root);
      });

    // Simulación de un filtro dinámico (puedes adaptarlo)
    this.route.queryParams.subscribe((params) => {
      this.filter = params['filter'] || null; // Leer filtro de los query params
    });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
        breadcrumbs.push({
          label: child.snapshot.data['breadcrumb'] || routeURL,
          url,
        });
      }
      console.log({breadcrumbs});
      
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
