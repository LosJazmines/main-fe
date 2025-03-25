import { Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../@shared/material/material.module';
import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import RegisterComponent from '../register/register.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Animations } from '../../../../@shared/animations';
import ChangePasswordComponent from '../change-password/change-password.component';
import { AuthService } from '../../../../@apis/auth.service';
import { Store } from '@ngrx/store';
import { TokenService } from '../../../../@core/services/token.service';
import * as userActions from '../../../../@shared/store/actions/user.actions';
import { MessageService } from '../../../../@core/services/snackbar.service';
import { LucideModule } from '@shared/lucide/lucide.module';
import CheckoutComponent from '../checkout/checkout.component';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
declare const google: any; // o usa window.google

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule, LucideModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [Animations],
})
export default class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('googleBtnWrapper') googleBtnWrapper!: ElementRef;

  loginGroup!: FormGroup;
  hide = true;
  formTouched = false;

  @Output() setViewType = new EventEmitter<any>();
  private _unsuscribeAll!: Subscription;

  constructor(
    private _fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    // private _dialog: Dialog,
    // @Inject(DIALOG_DATA) public data: any,
    private socialAuthService: SocialAuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _authService: AuthService,
    private store: Store,
    private _tokenService: TokenService,
    private _messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initGroupLogin();
  }

  ngOnDestroy(): void {
    // this._unsuscribeAll.unsubscribe();
  }

  private initGroupLogin() {
    this.loginGroup = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  googleSubscribe() {
    this._unsuscribeAll = this.socialAuthService.authState.subscribe((user) => {
      const payload = {
        email: user.email.toLowerCase(),
        provider: 'google',
        token: user.idToken,
      };

      this._unsuscribeAll = this._authService
        .login(payload)
        .subscribe((response: any) => {
          console.log('response', response);
          
          const { user, ...res } = response.results;

          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(res));
          }


          this.store.dispatch(
            userActions.setCurrentUser({ currentUser: user })
          );

          if (isPlatformBrowser(this.platformId)) {
            const redirectUrl = localStorage.getItem('redirectUrl');

            // if (redirectUrl) {
            //   localStorage.removeItem('redirectUrl');
            //   this.router.navigateByUrl(redirectUrl);
            // }
          }
          this.dialogRef.close();
        });
    });
  }


  submitEvent() {
    this.loginUser();
  }

  private loginUser() {
    if (this.loginGroup.valid) {
      const formData = this.loginGroup.value;
      // Llamada al servicio de autenticación para registrar al usuario
      this._authService.login(formData).subscribe({
        next: (response: any) => {
          const { token, ...res } = response;

          // Almacenar el token
          this._tokenService.setToken(response.token);

          // Establecer el usuario actual en el estado
          this.store.dispatch(userActions.setCurrentUser({ currentUser: res }));

          // this._messageService.showError(
          //   'Correo o contraseña incorrectos. Por favor, intenta de nuevo.',
          //   'top right',
          //   5000,
          //   'Aceptar'
          // );
          this.dialogRef.close();

          // Puedes agregar un mensaje de éxito o redirigir al usuario a otra página
        },
        error: (error) => {
          // En caso de error, se maneja aquí
          console.error('Error al Ingresar usuario:', error);
          // Puedes mostrar un mensaje de error si es necesario
        },
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  emitViewType(view: string) {
    this.setViewType.emit(view);
  }
}
