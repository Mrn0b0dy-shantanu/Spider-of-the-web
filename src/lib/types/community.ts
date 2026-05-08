
export type CommunityRequestStatus = 'pending' | 'partially_fulfilled' | 'fulfilled' | 'expired' | 'cancelled';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type FulfillmentStatus = 'pending' | 'in_progress' | 'delivered';

export interface CommunityRequest {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  urgency: UrgencyLevel;
  quantity_needed: number;
  quantity_fulfilled: number;
  location: string;
  image_url?: string;
  contact_info?: string;
  expires_at?: string;
  status: CommunityRequestStatus;
  is_pinned: boolean;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface CommunityFulfillment {
  id: string;
  request_id: string;
  user_id: string;
  quantity: number;
  status: FulfillmentStatus;
  notes?: string;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface CommunityComment {
  id: string;
  request_id: string;
  user_id: string;
  message: string;
  is_admin_update: boolean;
  created_at: string;
  user?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface CommunityNotification {
  id: string;
  user_id: string;
  request_id?: string;
  type: 'help_offered' | 'request_fulfilled' | 'admin_intervention' | 'comment_added';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CommunityOffer {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  quantity: number;
  location: string;
  help_methods: string[];
  status: 'available' | 'partially_given' | 'completed' | 'cancelled';
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}
