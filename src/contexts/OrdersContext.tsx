'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '@/types';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  addOrder: (orderData: Omit<Order, 'id'>) => Promise<string>;
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

  const addOrder = async (orderData: Omit<Order, 'id'>): Promise<string> => {
    try {
      console.log('OrdersContext: Starting to add order...', orderData);
      console.log('OrdersContext: orderData.items:', orderData.items);
      
      // Validate items data
      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        console.error('OrdersContext: Invalid items array:', orderData.items);
        throw new Error('Order must have at least one item');
      }
      
      // Check if items have the correct format
      const hasProductObjects = orderData.items.some(item => item.product && typeof item.product === 'object');
      const hasDirectFields = orderData.items.some(item => item.productId && item.name && item.price);
      
      let mongoOrderData;
      
      if (hasDirectFields) {
        // Items already have productId, name, price directly (from orders page)
        console.log('OrdersContext: Items have direct fields format');
        
        mongoOrderData = {
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerAddress: orderData.customerAddress,
          items: orderData.items.map((item: any, index) => {
            console.log(`OrdersContext: Processing direct item ${index}:`, item);
            
            if (!item.productId || !item.name || !item.price || !item.quantity) {
              console.error(`OrdersContext: Item ${index} missing required fields:`, item);
              throw new Error(`Item ${index} is missing required fields`);
            }
            
            return {
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            };
          }),
          totalAmount: orderData.totalAmount || orderData.total,
          paymentMethod: orderData.paymentMethod || 'cash',
          status: orderData.status || 'pending'
        };
      } else if (hasProductObjects) {
        // Items have product objects (from cart context)
        console.log('OrdersContext: Items have product objects format');
        
        // Log each item for detailed debugging
        orderData.items.forEach((item, index) => {
          console.log(`OrdersContext: Item ${index}:`, item);
          console.log(`OrdersContext: Item ${index} product:`, item?.product);
        });
        
        mongoOrderData = {
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          customerAddress: orderData.customerAddress,
          items: orderData.items.map((item, index) => {
            console.log(`OrdersContext: Processing product object item ${index}:`, item);
            
            // Check if item exists
            if (!item) {
              console.error(`OrdersContext: Item ${index} is null/undefined:`, item);
              throw new Error(`Item ${index} is missing`);
            }
            
            // Check if product exists
            if (!item.product) {
              console.error(`OrdersContext: Item ${index} product is null/undefined:`, item);
              throw new Error(`Item ${index} is missing product information`);
            }
            
            // Check if product.id exists
            if (!item.product.id) {
              console.error(`OrdersContext: Item ${index} product.id is missing:`, item.product);
              throw new Error(`Item ${index} product is missing ID`);
            }
            
            console.log(`OrdersContext: Successfully processing item ${index}`);
            
            return {
              productId: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            };
          }),
          totalAmount: orderData.totalAmount || orderData.total,
          paymentMethod: orderData.paymentMethod || 'cash',
          status: orderData.status || 'pending'
        };
      } else {
        console.error('OrdersContext: Invalid item format:', orderData.items);
        throw new Error('Invalid item format');
      }
      
      console.log('OrdersContext: Sending order data to API:', mongoOrderData);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mongoOrderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('OrdersContext: API Error:', errorData);
        throw new Error(errorData.error || 'Failed to add order');
      }
      
      const savedOrder = await response.json();
      console.log('OrdersContext: Order added to MongoDB with ID:', savedOrder._id);
      
      // Add to local state immediately
      const newOrder: Order = {
        ...savedOrder,
        id: savedOrder._id,
        total: savedOrder.totalAmount  // Map back to frontend format
      };
      setOrders(prev => [newOrder, ...prev]);
      
      console.log('OrdersContext: Order added to local state');
      
      return savedOrder._id;
    } catch (error) {
      console.error('OrdersContext: Error adding order:', error);
      throw error;
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