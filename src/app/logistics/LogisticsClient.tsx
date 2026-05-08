"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createInventoryItem } from "@/app/actions";

export function CreateLogisticsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createInventoryItem(formData);
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Stock
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Inventory Item">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Blankets" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="Medical">Medical</option>
              <option value="Food & Water">Food & Water</option>
              <option value="Shelter">Shelter</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" min="0" required placeholder="0" />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" name="unit" required placeholder="e.g. Boxes, Liters" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Warehouse/Hub Location</Label>
            <Input id="location" name="location" required placeholder="e.g. Dhaka Central" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
