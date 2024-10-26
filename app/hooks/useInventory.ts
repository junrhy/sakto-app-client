import { useState, useEffect, useMemo } from 'react';

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  images: string[];
}

const API_URL = '/api/inventory'; // Replace with your actual API endpoint

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return products.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key as keyof Product];
        return typeof value === 'string' && value.toLowerCase().includes(lowercasedFilter);
      });
    });
  }, [searchTerm, products]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error('Failed to add product');
      const addedProduct = await response.json();
      setProducts(prevProducts => [...prevProducts, addedProduct]);
      return addedProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`${API_URL}/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updated = await response.json();
      setProducts(products.map(product => 
        product.id === updated.id ? updated : product
      ));
      return updated;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return {
    products,
    filteredProducts,
    paginatedProducts,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  };
}
