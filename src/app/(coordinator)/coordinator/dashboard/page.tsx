import {
  getCoordinatorStats,
  getCoordinatorPendingRequests,
  getCoordinatorActiveRequests,
} from "@/app/actions/coordinator"
import { CoordinatorDashboardClient } from "./CoordinatorDashboardClient"

export const metadata = {
  title: "Dashboard | Request Coordinator AntiQuake",
}

export default async function CoordinatorDashboardPage() {
  const [stats, pendingRequests, activeRequests] = await Promise.all([
    getCoordinatorStats(),
    getCoordinatorPendingRequests(),
    getCoordinatorActiveRequests(),
  ])

  return (
    <CoordinatorDashboardClient
      stats={stats}
      pendingRequests={pendingRequests}
      activeRequests={activeRequests}
    />
  )
}
