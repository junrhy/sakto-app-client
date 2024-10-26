"use client"

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AddressesSection from "./AddressesSection";
import { Camera, CreditCard, Trash2, Star, StarOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentCard {
  id: number;
  cardNumber: string;
  expirationDate: string;
  cardholderName: string;
  isDefault: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  avatar: string;
  paymentCards: PaymentCard[];
}

export default function AccountProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    addresses: [
      { id: 1, street: "123 Main St", city: "Anytown", state: "CA", zipCode: "12345" }
    ],
    avatar: "/avatar-placeholder.png",
    paymentCards: [
      { id: 1, cardNumber: "**** **** **** 1234", expirationDate: "12/25", cardholderName: "John Doe", isDefault: true }
    ]
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState<Omit<PaymentCard, 'id' | 'isDefault'>>({
    cardNumber: '',
    expirationDate: '',
    cardholderName: '',
  });

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedProfile(profile);
  };

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditingProfile(false);
  };

  const handleCancelProfile = () => {
    setIsEditingProfile(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleEditAddresses = () => {
    setIsEditingAddresses(true);
  };

  const handleSaveAddresses = (newAddresses: Address[]) => {
    setProfile(prev => ({ ...prev, addresses: newAddresses }));
    setIsEditingAddresses(false);
  };

  const handleCancelAddresses = () => {
    setIsEditingAddresses(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCard = () => {
    setIsAddCardDialogOpen(true);
  };

  const handleSaveCard = () => {
    const newCardWithId: PaymentCard = {
      ...newCard,
      id: Date.now(),
      cardNumber: `**** **** **** ${newCard.cardNumber.slice(-4)}`,
      isDefault: profile.paymentCards.length === 0, // Make it default if it's the first card
    };
    setProfile(prev => ({
      ...prev,
      paymentCards: [...prev.paymentCards, newCardWithId],
    }));
    setIsAddCardDialogOpen(false);
    setNewCard({ cardNumber: '', expirationDate: '', cardholderName: '' });
  };

  const handleDeleteCard = (id: number) => {
    setProfile(prev => {
      const updatedCards = prev.paymentCards.filter(card => card.id !== id);
      // If the deleted card was the default, make the first remaining card (if any) the new default
      if (updatedCards.length > 0 && !updatedCards.some(card => card.isDefault)) {
        updatedCards[0].isDefault = true;
      }
      return {
        ...prev,
        paymentCards: updatedCards,
      };
    });
  };

  const handleSetDefaultCard = (id: number) => {
    setProfile(prev => ({
      ...prev,
      paymentCards: prev.paymentCards.map(card => ({
        ...card,
        isDefault: card.id === id,
      })),
    }));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Account Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Image
                  src={editedProfile.avatar}
                  alt="Profile Avatar"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                {isEditingProfile && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0"
                    onClick={handleAvatarClick}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editedProfile.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={editedProfile.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile}>Save</Button>
                  <Button variant="outline" onClick={handleCancelProfile}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <p>{profile.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{profile.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p>{profile.phone}</p>
                </div>
                <Button onClick={handleEditProfile}>Edit Profile</Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressesSection 
              addresses={profile.addresses} 
              onAddressesChange={handleSaveAddresses}
              isEditing={isEditingAddresses}
            />
            {isEditingAddresses ? (
              <div className="mt-4 flex space-x-2">
                <Button onClick={() => handleSaveAddresses(editedProfile.addresses)}>Save Addresses</Button>
                <Button variant="outline" onClick={handleCancelAddresses}>Cancel</Button>
              </div>
            ) : (
              <Button onClick={handleEditAddresses} className="mt-4">Edit Addresses</Button>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.paymentCards.map(card => (
                <div key={card.id} className="flex justify-between items-center">
                  <div>
                    <CreditCard className="inline-block mr-2" />
                    <span>{card.cardNumber}</span>
                    <p className="text-sm text-gray-500">Expires: {card.expirationDate}</p>
                    <p className="text-sm text-gray-500">{card.cardholderName}</p>
                    {card.isDefault && <span className="text-xs text-blue-500">Default</span>}
                  </div>
                  <div>
                    {!card.isDefault && (
                      <Button variant="outline" size="sm" className="mr-2" onClick={() => handleSetDefaultCard(card.id)}>
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCard(card.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={handleAddCard}>Add New Card</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardNumber" className="text-right">Card Number</Label>
              <Input
                id="cardNumber"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expirationDate" className="text-right">Expiration Date</Label>
              <Input
                id="expirationDate"
                value={newCard.expirationDate}
                onChange={(e) => setNewCard({ ...newCard, expirationDate: e.target.value })}
                placeholder="MM/YY"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardholderName" className="text-right">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={newCard.cardholderName}
                onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveCard}>Save Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
