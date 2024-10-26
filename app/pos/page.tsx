"use client"
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  quantity: number; // Add this line to include inventory quantity
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const ITEMS_PER_PAGE = 5;

export default function POS() {
  const [products] = useState<Product[]>([
    { id: 1, name: "Product A", price: 10.0, images: ["/images/product-a.jpg"], quantity: 50 },
    { id: 2, name: "Product B", price: 15.0, images: ["/images/product-b.jpg"], quantity: 30 },
    { id: 3, name: "Product C", price: 20.0, images: ["/images/product-c.jpg"], quantity: 20 },
    { id: 4, name: "Product D", price: 25.0, images: ["/images/product-d.jpg"], quantity: 15 },
    { id: 5, name: "Product E", price: 30.0, images: ["/images/product-e.jpg"], quantity: 25 },
    { id: 6, name: "Product F", price: 35.0, images: ["/images/product-f.jpg"], quantity: 10 },
    { id: 7, name: "Product G", price: 40.0, images: ["/images/product-g.jpg"], quantity: 5 },
  ]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCompleteSaleDialogOpen, setIsCompleteSaleDialogOpen] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const regex = new RegExp(term.split('').join('.*'), 'i');
    setFilteredProducts(
      products.filter((product) => regex.test(product.name))
    );
    setCurrentPage(1);
  };

  const addItemToOrder = (product: Product) => {
    if (product.quantity > 0) {
      const existingItem = orderItems.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.quantity) {
          setOrderItems(orderItems.map(item =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ));
        } else {
          alert("Cannot add more items than available in inventory.");
        }
      } else {
        setOrderItems([...orderItems, { ...product, quantity: 1 }]);
      }
    } else {
      alert("This product is out of stock.");
    }
  };

  const removeItemFromOrder = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const updateItemQuantity = (id: number, newQuantity: number) => {
    const product = products.find(p => p.id === id);
    if (product && newQuantity <= product.quantity) {
      if (newQuantity > 0) {
        setOrderItems(orderItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        removeItemFromOrder(id);
      }
    } else {
      alert("Cannot add more items than available in inventory.");
    }
  };

  const totalAmount = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleCompleteSale = () => {
    setIsCompleteSaleDialogOpen(true);
  };

  const confirmCompleteSale = () => {
    const cashReceivedAmount = parseFloat(cashReceived);
    if (isNaN(cashReceivedAmount) || cashReceivedAmount < totalAmount) {
      alert("Invalid amount received. Please enter a valid amount.");
      return;
    }

    const change = cashReceivedAmount - totalAmount;
    alert(`Sale completed!\nTotal: $${totalAmount.toFixed(2)}\nCash Received: $${cashReceivedAmount.toFixed(2)}\nChange: $${change.toFixed(2)}`);
    
    // Update inventory quantities
    const updatedProducts = products.map(product => {
      const soldItem = orderItems.find(item => item.id === product.id);
      if (soldItem) {
        return { ...product, quantity: product.quantity - soldItem.quantity };
      }
      return product;
    });
    
    // Reset the order and close the dialog
    setOrderItems([]);
    setCashReceived("");
    setIsCompleteSaleDialogOpen(false);
    // In a real application, you would update the products state or send the updated quantities to a backend
    console.log("Updated product quantities:", updatedProducts);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.images.length > 0 && (
                          <Image src={product.images[0]} alt={product.name} width={50} height={50} />
                        )}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => addItemToOrder(product)} disabled={product.quantity === 0}>
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <div>
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} entries
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {getPageNumbers().map(pageNumber => (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</Button>
                        <span>{item.quantity}</span>
                        <Button size="sm" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</Button>
                      </div>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => removeItemFromOrder(item.id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>Total: ${totalAmount.toFixed(2)}</div>
            <Button onClick={handleCompleteSale} disabled={orderItems.length === 0}>Complete Sale</Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isCompleteSaleDialogOpen} onOpenChange={setIsCompleteSaleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cashReceived">Cash Received</Label>
            <Input
              id="cashReceived"
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              placeholder="Enter amount received"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteSaleDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmCompleteSale}>Confirm Sale</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
