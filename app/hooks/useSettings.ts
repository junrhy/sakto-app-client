import { useState } from 'react';

const API_URL = '/api/settings'; // Replace with your actual API endpoint

export function useSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return false;
    }
    try {
      const response = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!response.ok) throw new Error('Failed to change password');
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError("Failed to change password. Please try again.");
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/delete-account`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete account');
      // Handle successful account deletion (e.g., logout, redirect)
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      return false;
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    changePassword,
    deleteAccount,
  };
}
