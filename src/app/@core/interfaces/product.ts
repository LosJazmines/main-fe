// Interfaz extendida para los productos (adaptada a la tabla de inventario)
export interface IProduct {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  type: string;
  price: number;
  stock: number;
  sold?: number;
  thumbnail?: string;
  active: boolean;
  // Propiedades opcionales para el formulario
  description?: string;
  maxPurchasePerUser?: number;
  cost?: number;
  basePrice?: number;
  taxPercent?: number;
  weight?: number;
  images: any[];
  tags?: any[];
}