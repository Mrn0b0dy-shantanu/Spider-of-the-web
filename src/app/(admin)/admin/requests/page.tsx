import { getAllRequests } from "@/app/actions/requests"
import AdminRequestsClient from "./RequestsClient"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"

export const metadata = { title: "Requests | AntiQuake Admin" }

export default async function AdminRequestsPage() {
  const requests = await getAllRequests()
  return (
    <>
      <RealtimeRefresh tables={["disaster_requests"]} />
      <AdminRequestsClient requests={requests} />
    </>
  )
}
