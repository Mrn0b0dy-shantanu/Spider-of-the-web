import { getAllRequests } from "@/app/actions/requests"
import AdminRequestsClient from "./RequestsClient"

export const metadata = { title: "Requests | NDC Admin" }

export default async function AdminRequestsPage() {
  const requests = await getAllRequests()
  return <AdminRequestsClient requests={requests} />
}
