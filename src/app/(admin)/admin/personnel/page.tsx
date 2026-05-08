import { getPersonnel } from "@/app/actions/admin"
import AdminPersonnelClient from "./PersonnelClient"

export const metadata = { title: "Personnel | AntiQuake Admin" }

export default async function AdminPersonnelPage() {
  const personnel = await getPersonnel()
  return <AdminPersonnelClient personnel={personnel} />
}
