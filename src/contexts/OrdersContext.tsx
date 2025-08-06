'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '@/types';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (orderData: Omit<Order, 'id'>) => Promise<{ success: boolean; data?: any; error?: string; }>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      console.log('OrdersContext: Loading orders from MongoDB...');
      setLoading(true);
      
      const response = await fetch('/api/orders');
      if (response.ok) {
        const ordersData = await response.json();
        const formattedOrders = ordersData.map((order: any) => ({
          ...order,
          id: order._id,
          createdAt: new Date(order.createdAt),
          total: order.totalAmount || order.total  // Ensure compatibility
        })) as Order[];
        
        console.log('OrdersContext: Loaded orders:', formattedOrders);
        setOrders(formattedOrders);
      } else {
        setOrders([]);
      }
      
    } catch (error) {
      console.error('OrdersContext: Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id'>): Promise<{ success: boolean; data?: any; error?: string; }> => {
    try {
      const transformedOrderData = {
        ...orderData,
        items: orderData.items.map(item => {
          const productId = item.productId || item.product?.id || item.product?._id;
          if (!productId) {
            throw new Error('A product ID is missing from an item in the order.');
          }
          return {
            productId: productId,
            name: item.name || item.product?.name,
            quantity: item.quantity,
            price: item.price || item.product?.price,
          };
        }),
        totalAmount: orderData.totalAmount || orderData.total,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedOrderData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('OrdersContext: API Error:', responseData);
        return { success: false, error: responseData.details || responseData.error || 'Failed to add order' };
      }
      
      console.log('OrdersContext: Order added to MongoDB with ID:', responseData._id);
      
      const newOrder: Order = {
        ...responseData,
        id: responseData._id,
        createdAt: new Date(responseData.createdAt),
        total: responseData.totalAmount
      };
      setOrders(prev => [newOrder, ...prev]);
      
      console.log('OrdersContext: Order added to local state');
      
      return { success: true, data: responseData };
    } catch (error) {
      console.error('OrdersContext: Error adding order:', error);
      return { success: false, error: error.message };
    }
  };

  const updateOrderStatus = async (id: string, status: string): Promise<void> => {
    try {
      console.log('OrdersContext: Updating order status...', id, status);
      
      // Update in MongoDB
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          updatedAt: new Date()
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      console.log('OrdersContext: Order status updated in MongoDB');
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === id 
          ? { ...order, status: status as any }
          : order
      ));
      
      console.log('OrdersContext: Order status updated in local state');
    } catch (error) {
      console.error('OrdersContext: Error updating order status:', error);
      throw error;
    }
  };

  const refreshOrders = async () => {
    await loadOrders();
  };

  const value: OrdersContextType = {
    orders,
    loading,
    addOrder,
    updateOrderStatus,
    refreshOrders
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}; 