import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessage } from '../models/contact-message.model';
import { CreateContactMessageDto } from '../models/create-contact-message.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.api}/contact-messages`;

  constructor(private http: HttpClient) {}

  // Enviar un nuevo mensaje
  sendMessage(createContactMessageDto: CreateContactMessageDto): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(this.apiUrl, createContactMessageDto);
  }

  // Obtener todos los mensajes (para el panel de administración)
  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl);
  }

  // Marcar mensaje como leído
  markAsRead(id: string): Observable<ContactMessage> {
    return this.http.patch<ContactMessage>(`${this.apiUrl}/${id}/read`, {});
  }

  // Eliminar mensaje
  deleteMessage(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
} 