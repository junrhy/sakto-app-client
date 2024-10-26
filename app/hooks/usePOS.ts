import { useState, useMemo, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface OrderItem extends Product {
  quantity: number;
}

const API_URL = '/api/pos'; // Replace with your actual API endpoint

export function usePOS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const completeOrder = async (order: OrderItem[]) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error('Failed to complete order');
      const completedOrder = await response.json();
      setOrderItems([]);
      return completedOrder;
    } catch (error) {
      console.error('Error completing order:', error);
      throw error;
    }
  };

  const filteredProducts = useMemo(() => {
    const regex = new RegExp(searchTerm.split('').join('.*'), 'i');
    return products.filter((product) => regex.test(product.name));
  }, [searchTerm, products]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const addItemToOrder = (product: Product) => {
    if (product.quantity > 0) {
      setOrderItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, product.quantity) }
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    }
  };

  const removeItemFromOrder = (id: number) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: number, newQuantity: number) => {
    setOrderItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, Math.min(newQuantity, item.quantity)) } : item
    ));
  };

  const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    products,
    filteredProducts,
    paginatedProducts,
    searchTerm,
    setSearchTerm,
    orderItems,
    currentPage,
    setCurrentPage,
    totalPages,
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    totalAmount,
    fetchProducts,
    completeOrder,
  };
}
