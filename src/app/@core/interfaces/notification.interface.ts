export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: 'ORDER' | 'CONTACT';
  read: boolean;
  createdAt: Date;
  relatedId?: string;
  userId?: string;
} 