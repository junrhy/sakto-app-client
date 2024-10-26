import { useState, useMemo, useEffect } from 'react';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

interface Table {
  id: number;
  name: string;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
}

const API_URL = '/api/restaurant-pos'; // Replace with your actual API endpoint

export function useRestaurantPOS() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<string>("");

  useEffect(() => {
    fetchMenuItems();
    fetchTables();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_URL}/menu-items`);
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await fetch(`${API_URL}/tables`);
      if (!response.ok) throw new Error('Failed to fetch tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const filteredMenuItems = useMemo(() => {
    return selectedCategory
      ? menuItems.filter(item => item.category === selectedCategory)
      : menuItems;
  }, [selectedCategory, menuItems]);

  const addItemToOrder = (item: MenuItem) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(orderItem => orderItem.id === item.id);
      if (existingItem) {
        return prevItems.map(orderItem =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItemFromOrder = (id: number) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setOrderItems(prevItems => prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    } else {
      removeItemFromOrder(id);
    }
  };

  const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const completeOrder = async (order: OrderItem[], tableNumber: string) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, tableNumber }),
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

  return {
    menuItems,
    filteredMenuItems,
    tables,
    setTables,
    orderItems,
    selectedCategory,
    setSelectedCategory,
    tableNumber,
    setTableNumber,
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    totalAmount,
    fetchMenuItems,
    fetchTables,
    completeOrder,
  };
}
