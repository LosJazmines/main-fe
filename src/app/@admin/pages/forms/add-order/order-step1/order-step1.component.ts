import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../../../../@apis/users.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../../@shared/material/material.module';
import { LucideModule } from '../../../../../@shared/lucide/lucide.module';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../../../../../@shared/components/loader/loader.component';
import { debounceTime, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from '../../../../../@apis/auth.service';

@Component({
  selector: 'app-order-step1',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    LucideModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderComponent,
  ],
  templateUrl: './order-step1.component.html',
  styleUrl: './order-step1.component.scss',
})
export class OrderStep1tComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  userFound: boolean = false;
  loading: boolean = false;
  searchCount: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      phone: [''],
    });
  }

  ngOnInit(): void {
    this.setupEmailSearch();
  }

  setupEmailSearch(): void {
    this.userForm
      .get('email')
      ?.valueChanges.pipe(
        debounceTime(400), // Esperar 400ms después de la última tecla
        switchMap((email: string) => {
          if (email.length < 4 || this.searchCount >= 3) {
            return of(null); // No hacer la búsqueda si el correo tiene menos de 4 caracteres o ya se ha hecho 3 búsquedas
          }
          this.searchCount++; // Incrementar el contador de búsquedas
          return this.userService.getUserByEmail(email); // Llamar al servicio para buscar el usuario
        }),
        takeUntil(this.destroy$) // Desuscribirse cuando el componente sea destruido
      )
      .subscribe((user: any) => {
        this.loading = false;
        if (user) {
          this.userForm.patchValue(user);
          this.userFound = true;
        } else {
          this.userFound = true;
        }
      });
  }

  onSubmit() {
      // Si no se encontró el usuario, registrar solo el correo electrónico
      const email = this.userForm.get('email')?.value;
      this.authService.registerEmail(email).subscribe(
        (user: any) => {
          // Aquí puedes manejar la respuesta, por ejemplo, redirigir al siguiente paso
          console.log('Correo registrado:', user);
        },
        (error: any) => {
          console.error('Error al registrar el correo:', error);
        }
      );
    
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Emitir valor para que se desuscriba
    this.destroy$.complete(); // Completar el observable
  }
}
