import { Incident, InventoryItem, Personnel, Organization, Request } from "../types";

// Dummy Data
const MOCK_INCIDENTS: Incident[] = [
  { id: "1", name: "Sylhet Flood Relief", type: "Flood", status: "Critical", location: "Sylhet Division", description: "Severe flooding affecting over 2 million people.", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", name: "Dhaka Earthquake Eq-7.1", type: "Earthquake", status: "Active", location: "Dhaka Metro", description: "Magnitude 7.1 earthquake. Infrastructure damage reported.", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "3", name: "Chittagong Landslide", type: "Landslide", status: "Monitoring", location: "Chittagong Hill Tracts", description: "Heavy rains caused landslides blocking major roads.", createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { id: "1", name: "Medical Kits", category: "Medical", quantity: 5400, unit: "Kits", location: "Central Warehouse", status: "Available" },
  { id: "2", name: "Clean Water", category: "Food & Water", quantity: 15000, unit: "Liters", location: "Sylhet Hub", status: "Available" },
  { id: "3", name: "Tents", category: "Shelter", quantity: 120, unit: "Units", location: "Chittagong Hub", status: "Low Stock" },
  { id: "4", name: "Generators", category: "Equipment", quantity: 0, unit: "Units", location: "Central Warehouse", status: "Out of Stock" },
];

const MOCK_PERSONNEL: Personnel[] = [
  { id: "1", name: "Dr. Ahmed Hossain", role: "Medical Officer", organization: "Red Crescent", status: "Deployed", location: "Sylhet Zone A" },
  { id: "2", name: "Sarah Khan", role: "Logistics Coordinator", organization: "NDC Relief", status: "Available", location: "Dhaka HQ" },
  { id: "3", name: "Team Alpha (S&R)", role: "Search & Rescue", organization: "Fire Service", status: "Deployed", location: "Dhaka Sector 4" },
];

const MOCK_ORGS: Organization[] = [
  { id: "1", name: "NDC ReliefOps", type: "Government", personnelCount: 1500, contactEmail: "contact@ndc.gov.bd" },
  { id: "2", name: "Red Crescent Society", type: "NGO", personnelCount: 3500, contactEmail: "info@redcrescent.org" },
  { id: "3", name: "UNICEF Bangladesh", type: "International", personnelCount: 800, contactEmail: "dhaka@unicef.org" },
];

const MOCK_REQUESTS: Request[] = [
  { id: "1", item: "Medical Kits", quantity: 500, unit: "Kits", destination: "Sylhet Zone A", priority: "High", status: "Pending" },
  { id: "2", item: "Search & Rescue Team", quantity: 2, unit: "Teams", destination: "Dhaka Sector 4", priority: "High", status: "Approved" },
  { id: "3", item: "Clean Water", quantity: 10000, unit: "Liters", destination: "Chittagong Camp", priority: "Medium", status: "Pending" },
];

// Service Functions
// TODO: Replace these with Supabase client calls later
// import { createClient } from '@supabase/supabase-js'

export async function getIncidents(): Promise<Incident[]> {
  // Simulating network delay
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_INCIDENTS), 500));
}

export async function getInventory(): Promise<InventoryItem[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_INVENTORY), 400));
}

export async function getPersonnel(): Promise<Personnel[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PERSONNEL), 300));
}

export async function getOrganizations(): Promise<Organization[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_ORGS), 200));
}

export async function getRequests(): Promise<Request[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_REQUESTS), 600));
}

export async function getDashboardStats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activeIncidents: MOCK_INCIDENTS.filter(i => i.status === "Active" || i.status === "Critical").length,
        deployedPersonnel: MOCK_PERSONNEL.filter(p => p.status === "Deployed").length,
        criticalSupplies: MOCK_INVENTORY.reduce((acc, curr) => acc + curr.quantity, 0),
        partnerOrgs: MOCK_ORGS.length
      });
    }, 400);
  });
}
