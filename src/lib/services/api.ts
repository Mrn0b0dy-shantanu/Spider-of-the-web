import { createClient } from "../supabase/server";
import { Incident, InventoryItem, Personnel, Organization, Request } from "../types";

// NOTE: Since we are using Supabase, these functions will fetch from the respective tables.
// If the tables do not exist yet, you will need to create them in the Supabase dashboard.

export async function getIncidents(): Promise<Incident[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('incidents').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching incidents:", error);
    return [];
  }
  return data as Incident[];
}

export async function getInventory(): Promise<InventoryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('inventory').select('*').order('name');
  if (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
  return data as InventoryItem[];
}

export async function getPersonnel(): Promise<Personnel[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('personnel').select('*').order('name');
  if (error) {
    console.error("Error fetching personnel:", error);
    return [];
  }
  return data as Personnel[];
}

export async function getOrganizations(): Promise<Organization[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('organizations').select('*').order('name');
  if (error) {
    console.error("Error fetching organizations:", error);
    return [];
  }
  return data as Organization[];
}

export async function getRequests(): Promise<Request[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
  return data as Request[];
}

export async function getDashboardStats() {
  const [incidents, inventory, personnel, orgs] = await Promise.all([
    getIncidents(),
    getInventory(),
    getPersonnel(),
    getOrganizations()
  ]);

  return {
    activeIncidents: incidents.filter(i => i.status === "Active" || i.status === "Critical").length,
    deployedPersonnel: personnel.filter(p => p.status === "Deployed").length,
    criticalSupplies: inventory.reduce((acc, curr) => acc + curr.quantity, 0),
    partnerOrgs: orgs.length
  };
}
