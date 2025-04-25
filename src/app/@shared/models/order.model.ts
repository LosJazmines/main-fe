export interface DeliveryInfo {
  direccion: string;
  ciudad: string;
  estado: string;
  pais: string;
  codigoPostal: string;
  telefonoMovil: string;
  nombre: string;
  metodoEnvio: 'PICKUP' | 'DELIVERY';
  comentarios?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  dialogData?: {
    orderId: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    total: number;
  };
} 