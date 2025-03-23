import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
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
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  filter: string | null = null; // Para mostrar el filtro si se desea

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Genera los breadcrumbs al iniciar y en cada cambio de navegación
    this.generateBreadcrumbs();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.generateBreadcrumbs();
      });

    // Suscribirse a los query params para obtener el filtro u otros parámetros dinámicos.
    this.route.queryParams.subscribe((params) => {
      this.filter = params['filter'] || null;
    });
  }

  private generateBreadcrumbs(): void {
    // Extraemos los query params para "flowerType" y "category"
    const queryParams = this.route.snapshot.queryParams;
    const type = queryParams['flowerType'] || null;
    const category = queryParams['category'] || null;

    // Iniciamos con el breadcrumb por defecto "Tienda" (url base para la tienda)
    let breadcrumbs: Breadcrumb[] = [{ label: 'Tienda', url: '/online-store' }];

    // Si existe un query param "category", se agrega un breadcrumb adicional.
    if (category) {
      const formattedCategory = this.formatLabel(category.replace(/-/g, ' '));
      // Puedes definir la URL de forma que se mantengan los filtros si se hace clic en este breadcrumb.
      breadcrumbs.push({
        label: formattedCategory,
        url: `/online-store?category=${category}${type ? '&flowerType=' + type : ''}`,
      });
    }

    // Si existe un query param "flowerType", se agrega otro breadcrumb.
    if (type) {
      const formattedType = this.formatLabel(type.replace(/-/g, ' '));
      // La URL podría ser la misma que la anterior o ajustarse según la navegación que desees.
      breadcrumbs.push({
        label: formattedType,
        url: `/online-store?${category ? 'category=' + category + '&' : ''}flowerType=${type}`,
      });
    }

    // Si no hay query params de filtros, se puede generar la estructura dinámica a partir de la ruta.
    if (!category && !type) {
      const dynamicBreadcrumbs = this.createBreadcrumbs(this.route.root);
      // Opcionalmente filtra para evitar duplicar "Online Store" si viene de la ruta
      const filteredDynamic = dynamicBreadcrumbs.filter(
        (crumb) => crumb.label.toLowerCase() !== 'online store'
      );
      breadcrumbs = [...breadcrumbs, ...filteredDynamic];
    }

    this.breadcrumbs = breadcrumbs;
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
        const label =
          child.snapshot.data['breadcrumb'] || this.formatLabel(routeURL);
        breadcrumbs.push({ label, url });
      }
      // Se asume que solo se necesita recorrer el primer hijo relevante para el breadcrumb.
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

  // Método para formatear el label, por ejemplo, capitalizando la primera letra.
  private formatLabel(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
