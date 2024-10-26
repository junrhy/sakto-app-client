import { useState, useEffect } from 'react';

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

const API_URL = '/api/profile'; // Replace with your actual API endpoint

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    addresses: [],
    avatar: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const updatedProfile = await response.json();
      setProfile(prevProfile => ({ ...prevProfile, ...updatedProfile }));
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addAddress = async (newAddress: Omit<Address, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });
      if (!response.ok) throw new Error('Failed to add address');
      const addedAddress = await response.json();
      setProfile(prevProfile => ({
        ...prevProfile,
        addresses: [...prevProfile.addresses, addedAddress]
      }));
      return addedAddress;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  };

  const updateAddress = (updatedAddress: Address) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      addresses: prevProfile.addresses.map(address =>
        address.id === updatedAddress.id ? updatedAddress : address
      )
    }));
  };

  const removeAddress = (id: number) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      addresses: prevProfile.addresses.filter(address => address.id !== id)
    }));
  };

  return {
    profile,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    fetchProfile,
  };
}
