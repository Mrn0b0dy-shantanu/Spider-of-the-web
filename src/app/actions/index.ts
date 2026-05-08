"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createIncident(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const location = formData.get("location") as string;
  const status = formData.get("status") as string;
  const description = formData.get("description") as string;

  const { error } = await supabase.from('incidents').insert([
    { name, type, location, status, description, created_at: new Date().toISOString() }
  ]);

  if (error) {
    console.error("Failed to create incident:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/incidents");
  revalidatePath("/");
  return { success: true };
}

export async function deleteIncident(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('incidents').delete().match({ id });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  revalidatePath("/incidents");
  revalidatePath("/");
  return { success: true };
}

export async function createInventoryItem(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const unit = formData.get("unit") as string;
  const location = formData.get("location") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase.from('inventory').insert([
    { name, category, quantity, unit, location, status, created_at: new Date().toISOString() }
  ]);

  if (error) return { success: false, error: error.message };

  revalidatePath("/logistics");
  revalidatePath("/");
  return { success: true };
}

export async function createPersonnel(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const organization = formData.get("organization") as string;
  const location = formData.get("location") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase.from('personnel').insert([
    { name, role, organization, location, status, created_at: new Date().toISOString() }
  ]);

  if (error) return { success: false, error: error.message };

  revalidatePath("/personnel");
  revalidatePath("/");
  return { success: true };
}

export async function createRequest(formData: FormData) {
  const supabase = await createClient();
  
  const item = formData.get("item") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const unit = formData.get("unit") as string;
  const destination = formData.get("destination") as string;
  const priority = formData.get("priority") as string;

  const { error } = await supabase.from('requests').insert([
    { item, quantity, unit, destination, priority, status: 'Pending', created_at: new Date().toISOString() }
  ]);

  if (error) return { success: false, error: error.message };

  revalidatePath("/requests");
  revalidatePath("/");
  return { success: true };
}

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const personnelCount = parseInt(formData.get("personnelCount") as string, 10);
  const contactEmail = formData.get("contactEmail") as string;

  const { error } = await supabase.from('organizations').insert([
    { 
      name, 
      type, 
      personnel_count: personnelCount, 
      contact_email: contactEmail, 
      created_at: new Date().toISOString() 
    }
  ]);

  if (error) return { success: false, error: error.message };

  revalidatePath("/organizations");
  revalidatePath("/");
  return { success: true };
}
