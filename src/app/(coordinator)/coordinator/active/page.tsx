import { getCoordinatorActiveRequests } from "@/app/actions/coordinator"
import { ActiveRequestsClient } from "./ActiveRequestsClient"

export const metadata = {
  title: "Active Requests | Request Coordinator FLARE",
}

export default async function CoordinatorActiveRequestsPage() {
  const requests = await getCoordinatorActiveRequests()

  return <ActiveRequestsClient requests={requests} />
}
