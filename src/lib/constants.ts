export const REQUEST_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  IN_PROGRESS: "in_progress",
  FULFILLED: "fulfilled",
} as const;

export const URGENCY_LEVELS = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export const SHELTER_STATUSES = {
  ACTIVE: "active",
  FULL: "full",
  CLOSED: "closed",
  MAINTENANCE: "maintenance",
} as const;

export const SUPPLY_STATUSES = {
  AVAILABLE: "available",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
} as const;

export const INCIDENT_STATUSES = {
  ACTIVE: "active",
  MONITORING: "monitoring",
  RESOLVED: "resolved",
  CRITICAL: "critical",
} as const;

export const INCIDENT_SEVERITIES = {
  MINOR: "minor",
  MODERATE: "moderate",
  SEVERE: "severe",
  CATASTROPHIC: "catastrophic",
} as const;
