import { getUserRequests } from "@/app/actions/requests"
import UserRequestsClient from "./UserRequestsClient"

export const metadata = { title: "My Requests | NDC Relief" }

export default async function UserRequestsPage() {
  const requests = await getUserRequests()
  return <UserRequestsClient requests={requests} />
}
