import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-error',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  template: `
    <div class="payment-error-container">
      <div class="error-card">
        <div class="error-icon">
          <mat-icon class="large-icon">error_outline</mat-icon>
        </div>
        
        <h1>Pago No Procesado</h1>
        
        <div class="error-details" *ngIf="errorDetails">
          <p class="error-message">{{ errorMessage }}</p>
          <div class="error-info">
            <p *ngIf="errorDetails.paymentId">ID de pago: {{ errorDetails.paymentId }}</p>
            <p *ngIf="errorDetails.status">Estado: {{ errorDetails.status }}</p>
          </div>
        </div>

        <div class="payment-options">
          <h2>¿Qué puedo hacer ahora?</h2>
          <div class="options-list">
            <div class="option">
              <mat-icon>credit_card</mat-icon>
              <p>Intentar con otra tarjeta</p>
            </div>
            <div class="option">
              <mat-icon>account_balance</mat-icon>
              <p>Usar otro método de pago</p>
            </div>
            <div class="option">
              <mat-icon>support_agent</mat-icon>
              <p>Contactar soporte</p>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="retryPayment()">
            <mat-icon>refresh</mat-icon>
            Intentar nuevamente
          </button>
          <button mat-stroked-button (click)="goBack()">
            <mat-icon>shopping_cart</mat-icon>
            Volver al carrito
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
      background-color: #f5f5f5;
    }

    .error-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .error-icon {
      margin-bottom: 1.5rem;
    }

    .large-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      color: #f44336;
    }

    h1 {
      color: #333;
      margin-bottom: 1.5rem;
      font-size: 24px;
    }

    .error-details {
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #f8f8f8;
      border-radius: 4px;
    }

    .error-message {
      color: #f44336;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .error-info {
      color: #666;
      font-size: 0.9rem;
    }

    .payment-options {
      margin-bottom: 2rem;
    }

    h2 {
      color: #333;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .options-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .option {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background-color: #f8f8f8;
      border-radius: 4px;
      transition: transform 0.2s;
    }

    .option:hover {
      transform: translateY(-2px);
      background-color: #f0f0f0;
    }

    .option mat-icon {
      color: #1976d2;
      margin-bottom: 0.5rem;
    }

    .option p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    button {
      min-width: 160px;
    }

    @media (max-width: 600px) {
      .options-list {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `]
})
export class PaymentErrorComponent implements OnInit {
  errorMessage: string = '';
  errorDetails: any;

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const storedError = localStorage.getItem('paymentError');
    if (storedError) {
      this.errorDetails = JSON.parse(storedError);
      this.errorMessage = this.errorDetails.message;
      localStorage.removeItem('paymentError');
    } else {
      this.router.navigate(['/']);
    }
  }

  retryPayment() {
    // Limpiar el error anterior
    localStorage.removeItem('mpError');
    
    // Recuperar la última orden
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      try {
        const orderData = JSON.parse(lastOrder);
        // Redirigir al checkout con los mismos items
        this.router.navigate(['/checkout'], { state: { items: orderData.items } });
      } catch (e) {
        console.error('Error parsing last order data:', e);
        this.router.navigate(['/cart']);
      }
    } else {
      this.router.navigate(['/cart']);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
} 