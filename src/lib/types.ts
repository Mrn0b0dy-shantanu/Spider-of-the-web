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

export type RequestStatus = "pending" | "approved" | "in_progress" | "rejected" | "fulfilled";

export interface DisasterRequest {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  urgency: "critical" | "high" | "medium" | "low";
  status: RequestStatus;
  location: string;
  contact_info?: string;
  created_at: string;
  admin_notes?: string;
  profiles?: {
    full_name: string;
    phone: string;
  };
  categories?: {
    name: string;
    icon: string;
  };
}
