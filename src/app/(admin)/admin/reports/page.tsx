import { getRequestsByStatus } from "@/app/actions/admin"
import AdminReportsClient from "./ReportsClient"

export const metadata = { title: "Reports | AntiQuake Admin" }

export default async function AdminReportsPage() {
  const { statusCounts, urgencyCounts } = await getRequestsByStatus()

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.replace("_", " ").toUpperCase(),
    value
  }))

  const urgencyData = Object.entries(urgencyCounts).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  }))

  return <AdminReportsClient statusData={statusData} urgencyData={urgencyData} />
}
