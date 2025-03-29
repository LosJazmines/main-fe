import { Component, OnInit, inject } from '@angular/core';
import { AdminHeaderStore } from '../../../@core/store/admin-header.store';
import { DrawerComponent } from '../../../@shared/components/drawer/drawer.component';
import { drawerMode } from '../../../@shared/components/drawer/drawer.types';
import { CommonModule } from '@angular/common';
import { Animations } from '../../../@shared/animations';
import { MaterialModule } from '../../../@shared/material/material.module';
import { LucideModule } from '../../../@shared/lucide/lucide.module';
import { Router, RouterModule } from '@angular/router';
import { MaintenancePlaceholderComponent } from '@shared/components/maintenance-placeholder/maintenance-placeholder.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, LucideModule, RouterModule, MaintenancePlaceholderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [Animations],
})
export default class DashboardComponent implements OnInit {
  private _adminHeaderStore = inject(AdminHeaderStore);
  public readonly adminHeaderStore$ = this._adminHeaderStore.getHeaderTitle();

  pedidos = [
    {
      id: 101,
      cliente: 'Juan Pérez',
      total: 45.0,
      fechaInicio: '2025-01-16',
      fechaEntrega: '2025-01-18',
      estado: 'Pendiente',
      imagen: 'https://via.placeholder.com/50',
    },
    {
      id: 102,
      cliente: 'María García',
      total: 60.0,
      fechaInicio: '2025-01-17',
      fechaEntrega: '2025-01-20',
      estado: 'Pendiente',
      imagen: 'https://via.placeholder.com/50',
    },
    // Más pedidos...
  ];

  drawerMode: drawerMode = 'over';
  drawerOpened: boolean = false;

  ngOnInit(): void {
    this._adminHeaderStore.updateHeaderTitle('Dashboard');
  }

  /**
   * Toggle the drawer mode
   */
  toggleDrawerMode(): void {
    this.drawerMode = this.drawerMode === 'side' ? 'over' : 'side';
  }

  /**
   * Toggle the drawer open
   */
  toggleDrawerOpen(): void {
    console.log({ drawerOpened: this.drawerOpened });

    this.drawerOpened = !this.drawerOpened;
  }

  /**
   * Drawer opened changed
   *
   * @param opened
   */
  drawerOpenedChanged(opened: boolean): void {
    this.drawerOpened = opened;
  }

  actualizarEstado(id: number, estado: string): void {
    // Actualiza el estado del pedido en la lista
    const pedido = this.pedidos.find((p) => p.id === id);
    if (pedido) {
      pedido.estado = estado;
    }

    // Aquí podrías integrar una llamada a un servicio que actualice la base de datos.
    console.log(`Pedido ${id} actualizado a: ${estado}`);
  }
}
