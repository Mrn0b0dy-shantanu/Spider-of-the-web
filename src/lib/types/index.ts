export type UserRole = "admin" | "user";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  location?: string;
  avatar_url?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export type RequestUrgency = "critical" | "high" | "medium" | "low";
export type RequestStatus = "pending" | "approved" | "rejected" | "in_progress" | "fulfilled";

export interface DisasterRequest {
  id: string;
  user_id: string;
  category_id?: string;
  title: string;
  description?: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  location?: string;
  latitude?: number;
  longitude?: number;
  contact_name?: string;
  contact_phone?: string;
  admin_notes?: string;
  assigned_to?: string;
  people_affected: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
  categories?: Category;
}

export interface RequestUpdate {
  id: string;
  request_id: string;
  old_status?: RequestStatus;
  new_status: RequestStatus;
  message?: string;
  updated_by?: string;
  created_at: string;
  // Joined fields
  profiles?: Profile;
}

export type SupplyStatus = "available" | "low_stock" | "out_of_stock";

export interface Supply {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  status: SupplyStatus;
  min_threshold: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export type ShelterStatus = "active" | "full" | "closed" | "maintenance";

export interface Shelter {
  id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  capacity: number;
  current_occupancy: number;
  status: ShelterStatus;
  contact_phone?: string;
  contact_person?: string;
  amenities: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export type NotificationType = "request_update" | "emergency" | "supply" | "system" | "announcement";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link?: string;
  created_at: string;
}

export type IncidentStatus = "active" | "monitoring" | "resolved" | "critical";
export type IncidentSeverity = "minor" | "moderate" | "severe" | "catastrophic";

export interface Incident {
  id: string;
  name: string;
  type: string;
  location: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  description?: string;
  affected_population: number;
  latitude?: number;
  longitude?: number;
  reported_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  organization: string;
  location: string;
  status: "deployed" | "available" | "off_duty" | "on_leave";
  phone?: string;
  email?: string;
  specialization?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  type: "government" | "ngo" | "private" | "international";
  personnel_count: number;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "low" | "normal" | "high" | "critical";
  is_active: boolean;
  expires_at?: string;
  created_by?: string;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: "police" | "fire" | "medical" | "disaster" | "general" | "hotline";
  description?: string;
  is_active: boolean;
  display_order: number;
}
