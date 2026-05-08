export type IncidentStatus = "Active" | "Monitoring" | "Resolved" | "Critical";

export interface Incident {
  id: string;
  name: string;
  type: string;
  status: IncidentStatus;
  location: string;
  description: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  status: "Available" | "Low Stock" | "Out of Stock";
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  organization: string;
  status: "Deployed" | "Available" | "Off-Duty";
  location: string;
}

export interface Organization {
  id: string;
  name: string;
  type: "Government" | "NGO" | "Private" | "International";
  personnelCount: number;
  contactEmail: string;
}

export interface Request {
  id: string;
  item: string;
  quantity: number;
  unit: string;
  destination: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Fulfilled";
}
