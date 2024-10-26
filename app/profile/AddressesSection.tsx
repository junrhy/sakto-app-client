import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface AddressesSectionProps {
  addresses: Address[];
  onAddressesChange: (newAddresses: Address[]) => void;
  isEditing: boolean;
}

export default function AddressesSection({ addresses, onAddressesChange, isEditing }: AddressesSectionProps) {
  const [editedAddresses, setEditedAddresses] = useState<Address[]>(addresses);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({ street: '', city: '', state: '', zipCode: '' });

  const handleAddressChange = (id: number, field: keyof Address, value: string) => {
    setEditedAddresses(prev => prev.map(addr =>
      addr.id === id ? { ...addr, [field]: value } : addr
    ));
  };

  const handleNewAddressChange = (field: keyof Omit<Address, 'id'>, value: string) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
  };

  const addNewAddress = () => {
    const newId = Math.max(0, ...editedAddresses.map(a => a.id)) + 1;
    setEditedAddresses(prev => [...prev, { id: newId, ...newAddress }]);
    setNewAddress({ street: '', city: '', state: '', zipCode: '' });
  };

  const removeAddress = (id: number) => {
    setEditedAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <div>
      {isEditing ? (
        <>
          {editedAddresses.map((address) => (
            <div key={address.id} className="mb-4 p-4 border rounded">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Address {address.id}</h4>
                <Button variant="ghost" size="sm" onClick={() => removeAddress(address.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                className="mb-2"
                placeholder="Street"
                value={address.street}
                onChange={(e) => handleAddressChange(address.id, 'street', e.target.value)}
              />
              <Input
                className="mb-2"
                placeholder="City"
                value={address.city}
                onChange={(e) => handleAddressChange(address.id, 'city', e.target.value)}
              />
              <Input
                className="mb-2"
                placeholder="State"
                value={address.state}
                onChange={(e) => handleAddressChange(address.id, 'state', e.target.value)}
              />
              <Input
                placeholder="Zip Code"
                value={address.zipCode}
                onChange={(e) => handleAddressChange(address.id, 'zipCode', e.target.value)}
              />
            </div>
          ))}
          <div className="mb-4 p-4 border rounded">
            <h4 className="font-semibold mb-2">Add New Address</h4>
            <Input
              className="mb-2"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) => handleNewAddressChange('street', e.target.value)}
            />
            <Input
              className="mb-2"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => handleNewAddressChange('city', e.target.value)}
            />
            <Input
              className="mb-2"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => handleNewAddressChange('state', e.target.value)}
            />
            <Input
              className="mb-2"
              placeholder="Zip Code"
              value={newAddress.zipCode}
              onChange={(e) => handleNewAddressChange('zipCode', e.target.value)}
            />
            <Button onClick={addNewAddress}>
              <Plus className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </div>
        </>
      ) : (
        addresses.map((address) => (
          <div key={address.id} className="mb-2">
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
          </div>
        ))
      )}
    </div>
  );
}
