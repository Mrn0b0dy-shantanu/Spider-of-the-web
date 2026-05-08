"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createOrganization } from "@/app/actions";

export function CreateOrganizationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createOrganization(formData);
    setLoading(false);
    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Organization
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Organization">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Red Crescent Society" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Organization Type</Label>
            <select 
              id="type" 
              name="type" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="Government">Government</option>
              <option value="NGO">NGO</option>
              <option value="Private">Private</option>
              <option value="International">International</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personnelCount">Personnel Count</Label>
            <Input id="personnelCount" name="personnelCount" type="number" min="0" required placeholder="0" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" name="contactEmail" type="email" required placeholder="contact@org.org" />
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Organization"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
