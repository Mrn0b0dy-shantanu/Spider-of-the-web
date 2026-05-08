"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createIncident, deleteIncident } from "@/app/actions";

export function IncidentActions({ id }: { id: string }) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => deleteIncident(id)}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      Delete
    </Button>
  );
}

export function CreateIncidentButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createIncident(formData);
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        New Incident
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Incident">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Incident Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Sylhet Flood" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <select 
              id="type" 
              name="type" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="Earthquake">Earthquake</option>
              <option value="Flood">Flood</option>
              <option value="Landslide">Landslide</option>
              <option value="Cyclone">Cyclone</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required placeholder="e.g. Sylhet Division" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select 
              id="status" 
              name="status" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="Active">Active</option>
              <option value="Critical">Critical</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" required placeholder="Brief description of the situation" />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
