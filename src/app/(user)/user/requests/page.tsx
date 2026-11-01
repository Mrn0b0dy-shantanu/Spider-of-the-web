import { getUserRequests } from "@/app/actions/requests"
import UserRequestsClient from "./UserRequestsClient"

export const metadata = { title: "My Requests | FLARE" }

export default async function UserRequestsPage() {
  const requests = await getUserRequests()
  return <UserRequestsClient requests={requests} />
}
