export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Alternative item format for orders API
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[] | OrderItem[];
  total: number;
  totalAmount?: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod?: 'cash' | 'card';
  createdAt: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const CATEGORIES = [
  'Offers',
  'Sandwiches',
  'Crepes',
  'Boxes',
  'Extras',
  'Meals'
] as const;

export type CategoryType = typeof CATEGORIES[number]; 