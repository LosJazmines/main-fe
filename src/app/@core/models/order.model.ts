export interface Order {
  id: string;
  orderNumber: number;
  total: number;
  subtotal: number;
  status: string;
  paymentMethod: string;
  nombreDestinatario: string;
  direccion: string;
  ciudad: string;
  estado: string;
  pais: string;
  telefono: string;
  telefonoMovil: string;
  comentarios: string;
  latitud: number;
  longitud: number;
  costoEnvio: string;
  metodoEnvio: string;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      images: any[];
      category: string;
      characteristics: string | null;
    };
  }[];
  customer: {
    id: string;
    username?: string;
    direccion?: string;
    telefono?: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    roles: string[];
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    thumbnail: string | null;
    description: string;
  };
} 