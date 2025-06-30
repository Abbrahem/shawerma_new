'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<string>;
  updateProduct: (id: string, productData: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshTrigger: number;
  triggerProductsRefresh: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('ProductsContext: Fetching products from MongoDB...');
      
      // Fetch from MongoDB only
      const response = await fetch('/api/products');
      if (response.ok) {
        const productsData = await response.json();
        if (productsData && productsData.length > 0) {
          const formattedProducts = productsData.map((product: any) => ({
            ...product,
            id: product._id,
            createdAt: new Date(product.createdAt)
          })) as Product[];
          
          console.log('ProductsContext: Loaded', formattedProducts.length, 'products from MongoDB');
          setProducts(formattedProducts);
        } else {
          console.log('ProductsContext: No products found in MongoDB');
          setProducts([]);
        }
      } else {
        console.log('ProductsContext: Failed to fetch from MongoDB');
        setProducts([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('ProductsContext: Error fetching products:', error);
      setProducts([]);
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
    try {
      console.log('ProductsContext: Starting to add product...', productData);
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        ...productData,
        createdAt: new Date()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('ProductsContext: API Error:', errorData);
        throw new Error(errorData.error || 'Failed to add product');
      }
      
      const savedProduct = await response.json();
      console.log('ProductsContext: Product added to MongoDB with ID:', savedProduct._id);
      
      // Add to local state immediately with proper formatting
      const newProduct: Product = {
        ...savedProduct,
        id: savedProduct._id,
        createdAt: new Date(savedProduct.createdAt)
      };
      setProducts(prev => [newProduct, ...prev]);
      
      console.log('ProductsContext: Product added to local state');
      
      return savedProduct._id;
    } catch (error) {
      console.error('ProductsContext: Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, 'id'>): Promise<void> => {
    try {
      console.log('ProductsContext: Starting to update product...', id, productData);
      
      // Update in MongoDB
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        ...productData,
        updatedAt: new Date()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('ProductsContext: API Error:', errorData);
        throw new Error(errorData.error || 'Failed to update product');
      }
      
      const updatedProductFromDB = await response.json();
      console.log('ProductsContext: Product updated in MongoDB:', updatedProductFromDB);
      
      // Update local state with the response from database
      setProducts(prev => prev.map(product => 
        product.id === id 
          ? { 
              ...updatedProductFromDB,
              id: updatedProductFromDB._id,
              createdAt: new Date(updatedProductFromDB.createdAt)
            }
          : product
      ));
      
      console.log('ProductsContext: Product updated in local state');
    } catch (error) {
      console.error('ProductsContext: Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      console.log('ProductsContext: Starting to delete product...', id);
      
      // Delete from MongoDB
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      console.log('ProductsContext: Product deleted from MongoDB');
      
      // Remove from local state
      setProducts(prev => prev.filter(product => product.id !== id));
      
      console.log('ProductsContext: Product removed from local state');
    } catch (error) {
      console.error('ProductsContext: Error deleting product:', error);
      throw error;
    }
  };

  const refreshProducts = async () => {
    setLoading(true);
    await fetchProducts();
    setLoading(false);
  };

  const triggerProductsRefresh = () => {
    console.log('🔄 ProductsContext: Triggering products refresh...');
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value: ProductsContextType = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    refreshTrigger,
    triggerProductsRefresh
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}; 