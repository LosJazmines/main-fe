import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../../@core/services/token.service';
import * as userActions from '../../../../@shared/store/actions/user.actions';
import { MessageService } from '../../../../@core/services/snackbar.service';
import { AuthService } from '../../../../@apis/auth.service';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="p-8 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Procesando inicio de sesión con Google...</h2>
        <p class="text-gray-600">Por favor, espere un momento mientras completamos su inicio de sesión.</p>
        <div *ngIf="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p class="font-bold">Error:</p>
          <p>{{ error }}</p>
          <button 
            (click)="retryLogin()" 
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export default class GoogleCallbackComponent implements OnInit {
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private tokenService: TokenService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check for error parameters in the URL
    this.route.queryParams.subscribe(params => {
      const error = params['error'];
      
      if (error) {
        this.error = `Error de autenticación: ${error}`;
        console.error('Google auth error:', error);
        return;
      }
      
      const token = params['token'];
      
      if (token) {
        // Store the token
        this.tokenService.setToken(token);
        
        // Validate the token to get user data
        this.validateTokenAndLogin(token);
      } else {
        this.error = 'No se recibió el token de autenticación';
        this.messageService.showError(
          'Error al iniciar sesión con Google. No se recibió el token.',
          'top right',
          5000,
          'Aceptar'
        );
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }
    });
  }

  retryLogin() {
    this.router.navigate(['/login']);
  }

  private validateTokenAndLogin(token: string): void {
    this.authService.validateToken(token).subscribe({
      next: (response: any) => {
        console.log('Token validation response:', response);
        
        // Update the store with user data
        this.store.dispatch(
          userActions.setCurrentUser({ currentUser: response })
        );
        
        // Redirect to home page
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error validating token:', error);
        this.error = 'Error al validar el token. Por favor, intente iniciar sesión nuevamente.';
        this.messageService.showError(
          'Error al validar el token. Por favor, intente iniciar sesión nuevamente.',
          'top right',
          5000,
          'Aceptar'
        );
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }
    });
  }
} 