"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { createPersonnel } from "@/app/actions";

export function CreatePersonnelButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createPersonnel(formData);
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Personnel
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Personnel">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name / Team Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Dr. Ahmed Hossain" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required placeholder="e.g. Medical Officer" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" name="organization" required placeholder="e.g. Red Crescent" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Deployment Location</Label>
            <Input id="location" name="location" required placeholder="e.g. Sylhet Zone A" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select id="status" name="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
              <option value="Available">Available</option>
              <option value="Deployed">Deployed</option>
              <option value="Off-Duty">Off-Duty</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Personnel"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
