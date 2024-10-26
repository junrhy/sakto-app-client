"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigation } from '@/contexts/NavigationContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Color = 'zinc' | 'slate' | 'stone' | 'gray' | 'neutral' | 'red' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet';

export default function Settings() {
  const { 
    navigationItems, 
    updateNavigationItem, 
    currency, 
    setCurrency, 
    appName, 
    setAppName,
    theme,
    setTheme,
    color,
    setColor
  } = useNavigation();
  
  const [newAppName, setNewAppName] = useState(appName);
  const [newCurrency, setNewCurrency] = useState(currency);

  const handleAppNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    setAppName(newAppName);
  };

  const handleCurrencyChange = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrency(newCurrency);
  };

  const handleToggleNavigationItem = (id: string, enabled: boolean) => {
    updateNavigationItem(id, enabled);
  };

  const colors: Color[] = ['zinc', 'slate', 'stone', 'gray', 'neutral', 'red', 'rose', 'orange', 'green', 'blue', 'yellow', 'violet'];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change App Name</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAppNameChange} className="space-y-4">
                <div>
                  <Label htmlFor="appName">App Name</Label>
                  <Input
                    id="appName"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    placeholder="Enter new app name"
                  />
                </div>
                <Button type="submit">Update App Name</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Currency</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCurrencyChange} className="space-y-4">
                <div>
                  <Label htmlFor="currency">Currency Symbol</Label>
                  <Input
                    id="currency"
                    value={newCurrency}
                    onChange={(e) => setNewCurrency(e.target.value)}
                    placeholder="Enter currency symbol"
                  />
                </div>
                <Button type="submit">Update Currency</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={theme} 
                onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Navigation Items Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {navigationItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.path}</TableCell>
                      <TableCell>{item.enabled ? 'Enabled' : 'Disabled'}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.enabled}
                          onCheckedChange={(checked) => handleToggleNavigationItem(item.id, checked)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Color Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {colors.map((c) => (
                <Button
                  key={c}
                  className={`w-full h-12 ${color === c ? 'ring-2 ring-offset-2 ring-offset-background' : ''}`}
                  style={{ backgroundColor: `hsl(var(--${c}-500))` }}
                  onClick={() => setColor(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
