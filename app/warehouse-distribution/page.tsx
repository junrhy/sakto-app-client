"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigation } from '@/contexts/NavigationContext';

type Product = {
  id: string;
  name: string;
  quantity: number;
  location: string;
};

export default function WarehouseDistribution() {
  const { currency } = useNavigation();
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Product A', quantity: 100, location: 'Warehouse 1' },
    { id: '2', name: 'Product B', quantity: 150, location: 'Warehouse 2' },
  ]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', location: '' });

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(newProduct.quantity);
    if (isNaN(quantity)) return;
    setProducts([...products, { 
      id: Date.now().toString(), 
      name: newProduct.name, 
      quantity, 
      location: newProduct.location 
    }]);
    setNewProduct({ name: '', quantity: '', location: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Warehouse and Distribution</h1>
      
      <form onSubmit={addProduct} className="mb-6 space-y-4">
        <Input
          placeholder="Product Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          required
        />
        <Input
          placeholder="Location"
          value={newProduct.location}
          onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
          required
        />
        <Button type="submit">Add Product</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
