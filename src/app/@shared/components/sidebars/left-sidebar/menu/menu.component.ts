import { Component, Input, OnInit } from '@angular/core';
import { Animations } from '../../../../animations';
import { MaterialModule } from '../../../../material/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from '@core/interfaces/menu_sidebar';
import { LucideModule } from '@shared/lucide/lucide.module';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, LucideModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  animations: [Animations],
})
export class MenuComponent implements OnInit {
  @Input() items: MenuItem[] = [];
  @Input() userRole!: string; // ejemplo: 'admin' o 'user'
  @Input() onItemClick: (event: Event) => void = () => { };

  // Filtramos según rol (si la propiedad roles está definida)
  filteredItems: MenuItem[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filteredItems = this.items.filter(item => {
      if (!item.roles) {
        return true;
      }
      return item.roles.includes(this.userRole);
    });
  }

  navigate(item: MenuItem, event: Event) {
    // Llamamos a la función que cierra el sidebar, por ejemplo
    this.onItemClick(event);
    // Navegamos al route
    this.router.navigate([item.route]);
  }
}
