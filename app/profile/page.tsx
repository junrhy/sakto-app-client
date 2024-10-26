"use client"

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import AddressesSection from "./AddressesSection";
import { Camera } from "lucide-react";

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  avatar: string;
}

export default function AccountProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    addresses: [
      { id: 1, street: "123 Main St", city: "Anytown", state: "CA", zipCode: "12345" }
    ],
    avatar: "/avatar-placeholder.png" // Default avatar
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      </div>
    </div>
  );
}
