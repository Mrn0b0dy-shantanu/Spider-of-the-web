import { getIncidents } from "@/app/actions/admin"
import AdminIncidentsClient from "./IncidentsClient"

export const metadata = { title: "Incidents | NDC Admin" }

export default async function AdminIncidentsPage() {
  const incidents = await getIncidents()
  return <AdminIncidentsClient incidents={incidents} />
}
