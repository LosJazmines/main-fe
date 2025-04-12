import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './snackbar.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

export interface MercadoPagoAccount {
  id: number;
  accessToken: string;
  publicKey: string;
  storeName: string;
  contactEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private apiUrl = 'https://api.mercadopago.com';
  private accounts: MercadoPagoAccount[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Load saved accounts from localStorage only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.loadAccounts();
    }
  }

  /**
   * Load saved accounts from localStorage
   */
  private loadAccounts(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedAccounts = localStorage.getItem('mercadoPagoAccounts');
      if (savedAccounts) {
        this.accounts = JSON.parse(savedAccounts);
      }
    }
  }

  /**
   * Save accounts to localStorage
   */
  private saveAccounts(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('mercadoPagoAccounts', JSON.stringify(this.accounts));
    }
  }

  /**
   * Get all MercadoPago accounts
   */
  getAccounts(): Observable<MercadoPagoAccount[]> {
    return of(this.accounts);
  }

  /**
   * Add a new MercadoPago account
   */
  addAccount(account: MercadoPagoAccount): Observable<MercadoPagoAccount> {
    // Validate the account credentials
    return this.validateCredentials(account).pipe(
      map(isValid => {
        if (!isValid) {
          throw new Error('Invalid MercadoPago credentials');
        }
        
        // Add ID if not present
        if (!account.id) {
          account.id = this.accounts.length > 0 
            ? Math.max(...this.accounts.map(a => a.id)) + 1 
            : 1;
        }
        
        // Add to accounts array
        this.accounts.push(account);
        this.saveAccounts();
        
        this.messageService.showInfo(
          'Cuenta de MercadoPago agregada correctamente',
          'top center'
        );
        
        return account;
      }),
      catchError(error => {
        this.messageService.showError(
          'Error al agregar cuenta de MercadoPago: ' + error.message,
          'top center'
        );
        throw error;
      })
    );
  }

  /**
   * Update an existing MercadoPago account
   */
  updateAccount(account: MercadoPagoAccount): Observable<MercadoPagoAccount> {
    // Validate the account credentials
    return this.validateCredentials(account).pipe(
      map(isValid => {
        if (!isValid) {
          throw new Error('Invalid MercadoPago credentials');
        }
        
        const index = this.accounts.findIndex(a => a.id === account.id);
        if (index === -1) {
          throw new Error('Account not found');
        }
        
        // Update account
        this.accounts[index] = account;
        this.saveAccounts();
        
        this.messageService.showInfo(
          'Cuenta de MercadoPago actualizada correctamente',
          'top center'
        );
        
        return account;
      }),
      catchError(error => {
        this.messageService.showError(
          'Error al actualizar cuenta de MercadoPago: ' + error.message,
          'top center'
        );
        throw error;
      })
    );
  }

  /**
   * Delete a MercadoPago account
   */
  deleteAccount(id: number): Observable<boolean> {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index === -1) {
      return of(false);
    }
    
    this.accounts.splice(index, 1);
    this.saveAccounts();
    
    this.messageService.showInfo(
      'Cuenta de MercadoPago eliminada correctamente',
      'top center'
    );
    
    return of(true);
  }

  /**
   * Validate MercadoPago credentials
   */
  private validateCredentials(account: MercadoPagoAccount): Observable<boolean> {
    // In a real implementation, you would call the MercadoPago API to validate credentials
    // For now, we'll just check if the access token and public key are not empty
    return of(!!account.accessToken && !!account.publicKey);
  }

  /**
   * Create a payment preference
   */
  createPaymentPreference(data: any): Observable<any> {
    // In a real implementation, you would call the MercadoPago API to create a payment preference
    // For now, we'll just return a mock response
    return of({
      id: 'mock-preference-id',
      init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-preference-id',
      sandbox_init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock-preference-id'
    });
  }
} 