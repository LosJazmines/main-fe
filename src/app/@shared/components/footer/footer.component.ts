import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideModule } from '@shared/lucide/lucide.module';
import { CommonModule } from '@angular/common';
import { ContactService } from '@shared/services/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideModule, ReactiveFormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  async onSubmit() {
    if (this.contactForm.invalid) return;

    try {
      this.isSubmitting = true;
      await this.contactService.sendMessage(this.contactForm.value).toPromise();
      
      this.contactForm.reset();
      this.snackBar.open(
        '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.',
        'Cerrar',
        { duration: 5000 }
      );
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      this.snackBar.open(
        'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
        'Cerrar',
        { duration: 5000 }
      );
    } finally {
      this.isSubmitting = false;
    }
  }
}
