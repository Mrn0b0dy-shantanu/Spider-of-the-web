import { getCoordinatorPendingRequests } from "@/app/actions/coordinator"
import { PendingRequestsClient } from "./PendingRequestsClient"

export const metadata = {
  title: "Pending Requests | Request Coordinator FLARE",
}

export default async function CoordinatorPendingRequestsPage() {
  const requests = await getCoordinatorPendingRequests()

  return <PendingRequestsClient requests={requests} />
}
