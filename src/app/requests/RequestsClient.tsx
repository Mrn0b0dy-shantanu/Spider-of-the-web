"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createRequest } from "@/app/actions";

export function CreateRequestButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createRequest(formData);
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Request
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Resource Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Requested Item</Label>
            <Input id="item" name="item" required placeholder="e.g. Medical Kits" />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" min="1" required placeholder="1" />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" name="unit" required placeholder="e.g. Kits, Liters" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input id="destination" name="destination" required placeholder="e.g. Sylhet Zone A" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select id="priority" name="priority" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
