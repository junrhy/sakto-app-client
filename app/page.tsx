"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, LayoutGrid, Columns, Columns3, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase";
import { useNavigate } from 'react-router-dom';

type WidgetType = "sales" | "inventory" | "orders";

interface Widget {
  id: number;
  type: WidgetType;
  column: number;
}

const WidgetComponent: React.FC<{ 
  widget: Widget; 
  onRemove: (id: number) => void;
  onMoveLeft: (id: number) => void;
  onMoveRight: (id: number) => void;
  isLeftmost: boolean;
  isRightmost: boolean;
}> = ({ widget, onRemove, onMoveLeft, onMoveRight, isLeftmost, isRightmost }) => {
  return (
    <Card className="h-full mb-4 relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {widget.type === "sales" && "Sales Overview"}
          {widget.type === "inventory" && "Inventory Status"}
          {widget.type === "orders" && "Recent Orders"}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => onRemove(widget.id)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Placeholder content for each widget type */}
        {widget.type === "sales" && <p>Sales data visualization would go here.</p>}
        {widget.type === "inventory" && <p>Inventory levels and alerts would be displayed here.</p>}
        {widget.type === "orders" && <p>A list of recent orders would be shown here.</p>}
      </CardContent>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onMoveLeft(widget.id)}
          disabled={isLeftmost}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onMoveRight(widget.id)}
          disabled={isRightmost}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default function Home() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidgetType, setSelectedWidgetType] = useState<WidgetType | null>(null);
  const [columnCount, setColumnCount] = useState<1 | 2 | 3>(2);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      fetchWidgets();
      checkUser();
      setLoading(false);
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setWidgets([]);
    navigate(0);
  };

  const fetchWidgets = async () => {
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching widgets:', error);
    } else {
      setWidgets(data || []);
    }
  };

  const addWidget = async () => {
    if (selectedWidgetType) {
      const newWidget: Widget = {
        id: Date.now(),
        type: selectedWidgetType,
        column: 0,
      };

      const { data, error } = await supabase
        .from('widgets')
        .insert(newWidget)
        .select();

      if (error) {
        console.error('Error adding widget:', error);
      } else if (data) {
        setWidgets([...widgets, data[0]]);
        setSelectedWidgetType(null);
      }
    }
  };

  const removeWidget = async (id: number) => {
    const { error } = await supabase
      .from('widgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing widget:', error);
    } else {
      setWidgets(widgets.filter(widget => widget.id !== id));
    }
  };

  const moveWidget = async (id: number, direction: 'left' | 'right') => {
    const updatedWidgets = widgets.map(widget => {
      if (widget.id === id) {
        const newColumn = direction === 'left' 
          ? Math.max(0, widget.column - 1)
          : Math.min(columnCount - 1, widget.column + 1);
        return { ...widget, column: newColumn };
      }
      return widget;
    });

    const updatedWidget = updatedWidgets.find(w => w.id === id);
    if (updatedWidget) {
      const { error } = await supabase
        .from('widgets')
        .update({ column: updatedWidget.column })
        .eq('id', id);

      if (error) {
        console.error('Error moving widget:', error);
      } else {
        setWidgets(updatedWidgets);
      }
    }
  };

  const getColumnClass = () => {
    switch (columnCount) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 lg:grid-cols-[1fr,2fr]';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-7xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {user && <span>Welcome, {user.email}</span>}
          <Button onClick={handleLogout}>Log out</Button>
        </div>
      </div>
      
      <div className="w-full flex justify-between max-w-7xl mb-8">
        <div className="flex space-x-4 mb-4">
          <Select value={selectedWidgetType || ""} onValueChange={(value: string) => setSelectedWidgetType(value as WidgetType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select widget" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales Overview</SelectItem>
              <SelectItem value="inventory">Inventory Status</SelectItem>
              <SelectItem value="orders">Recent Orders</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addWidget} disabled={!selectedWidgetType}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setColumnCount(1)} variant={columnCount === 1 ? "default" : "outline"}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button onClick={() => setColumnCount(2)} variant={columnCount === 2 ? "default" : "outline"}>
            <Columns className="h-4 w-4" />
          </Button>
          <Button onClick={() => setColumnCount(3)} variant={columnCount === 3 ? "default" : "outline"}>
            <Columns3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`w-full max-w-7xl grid gap-6 ${getColumnClass()}`}>
        {Array.from({ length: columnCount }).map((_, columnIndex) => (
          <div key={columnIndex} className="space-y-6">
            {widgets
              .filter(widget => widget.column === columnIndex)
              .map(widget => (
                <WidgetComponent 
                  key={widget.id} 
                  widget={widget} 
                  onRemove={removeWidget}
                  onMoveLeft={() => moveWidget(widget.id, 'left')}
                  onMoveRight={() => moveWidget(widget.id, 'right')}
                  isLeftmost={widget.column === 0}
                  isRightmost={widget.column === columnCount - 1}
                />
              ))}
          </div>
        ))}
      </div>
    </main>
  )
}
