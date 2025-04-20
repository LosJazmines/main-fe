import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideModule } from '@shared/lucide/lucide.module';
import { User } from '@apis/users.service';
import { CustomSelectComponent } from '../custom-select/custom-select.component';
import { UserRoles, RoleLabels } from '@shared/enums/roles.enum';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideModule, CustomSelectComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Output() formSubmit = new EventEmitter<Partial<User>>();
  @Output() formCancel = new EventEmitter<void>();

  userForm: FormGroup;
  private fb = inject(FormBuilder);

  roleOptions = [
    { id: [UserRoles.USER], text: RoleLabels[UserRoles.USER] },
    { id: [UserRoles.ADMIN], text: RoleLabels[UserRoles.ADMIN] },
    { id: [UserRoles.ENCARGADO], text: RoleLabels[UserRoles.ENCARGADO] }
  ];

  constructor() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
      ]],
      address: [''],
      phoneNumber: [''],
      roles: [[], Validators.required],
      isActive: [true]
    });
  }

  ngOnInit() {
    this.updateFormValues();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && !changes['user'].firstChange) {
      this.updateFormValues();
    }
  }

  private updateFormValues() {
    if (this.user) {
      console.log('Updating form with user data:', this.user);
      
      // Set initial form values
      const userRoles = this.user.roles || [UserRoles.USER];
      console.log('User roles:', userRoles);

      this.userForm.patchValue({
        email: this.user.email || '',
        username: this.user.username || '',
        address: this.user.address || '',
        phoneNumber: this.user.phoneNumber || '',
        roles: userRoles,
        isActive: this.user.isActive ?? true
      });

      // Find matching role option
      console.log('Available role options:', this.roleOptions);
      const roleOption = this.roleOptions.find(option => {
        const optionIds = option.id.sort();
        const userRolesSorted = userRoles.sort();
        console.log('Comparing:', optionIds, 'with', userRolesSorted);
        return JSON.stringify(optionIds) === JSON.stringify(userRolesSorted);
      });

      console.log('Selected role option:', roleOption);
      
      if (roleOption) {
        this.userForm.get('roles')?.setValue(roleOption.id, { emitEvent: true });
      } else {
        console.warn('No matching role option found for user roles:', userRoles);
        // Fallback to first matching role if exact match not found
        const fallbackOption = this.roleOptions.find(option => 
          userRoles.some(role => option.id.includes(role as UserRoles))
        );
        if (fallbackOption) {
          this.userForm.get('roles')?.setValue(fallbackOption.id, { emitEvent: true });
        }
      }

      // Remove password validation when editing
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      // For new users, set default role
      this.userForm.get('roles')?.setValue([UserRoles.USER], { emitEvent: true });
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = { ...this.userForm.value };
      
      // If we're updating an existing user, remove the password field
      if (this.user) {
        delete formValue.password;
      }
      
      this.formSubmit.emit(formValue);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }
} 