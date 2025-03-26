import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
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
import {
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
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
export class OrderStep1Component implements OnInit, OnDestroy {
  @Output() stepCompleted = new EventEmitter<any>(); // Emitir evento al padre
  @Output() stepBack = new EventEmitter<void>(); // Evento para regresar al paso anterior


  userForm!: FormGroup;
  userFound = signal<boolean>(false); // Indica si el usuario fue encontrado en la base de datos o false;
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private authService: AuthService
  ) {
    this.setUserForm();
  }

  ngOnInit(): void {
    this.setupEmailSearch();
  }

  private setUserForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      customerId: ['', [Validators.required]],
      name: [''],
      phone: [''],
    });
  }

  setupEmailSearch(): void {
    this.userForm
      .get('email')
      ?.valueChanges.pipe(
        // debounceTime(400),
        map((search) => search?.trim()),
        debounceTime(400),
        distinctUntilChanged(),
        // switchMap((email: string) => {
        //   if (email.length < 4) return of(null);
        //   this.loading = true;
        //   return of(email);
        // }),
        takeUntil(this.destroy$)
      )
      .subscribe((email: any) => {
        console.log('email', email);

        this.userService.getUserByEmail(email).subscribe((user: any) => {
          console.log('user', user);

          this.loading = false;
          if (user) {
            this.userForm.get('email')?.setValue(user.email);
            this.userForm.get('customerId')?.setValue(user.id);
            this.userForm.get('name')?.setValue(user.username);
            this.userFound.set(true);
          } else {
            this.userFound.set(false);
          }
        });
      });
  }

  searchUserByEmail(): void {
    // const email = this.userForm.get('email')?.value;
    // if (!email || email.length < 4) return; // No buscar si el email es inválido
    // this.loading = true;
    // this.userService
    //   .getUserByEmail(email)
    //   .pipe(take(1))
    //   .subscribe((user: any) => {
    //     this.loading = false;
    //     if (user) {
    //       this.userForm.patchValue(user);
    //       this.userFound = true;
    //     } else {
    //       this.userFound = false; // Habilita el botón de guardar
    //     }
    //   });
  }
  // Método para guardar nuevo usuario si no existe
  saveUser(): void {
    const email = this.userForm.get('email')?.value;

    if (email !== '') {
      this.authService.registerEmail(email).subscribe((user: any) => {
        this.userFound.set(true);
        this.userForm.get('customerId')?.setValue(user.id);
      });
    }
  }
  onSubmit() {
    console.log('Formulario enviado:', this.userForm.value, this.userFound());

    if (this.userForm.valid && this.userFound()) {
      this.stepCompleted.emit(this.userForm.value); // Enviar datos al padre
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
