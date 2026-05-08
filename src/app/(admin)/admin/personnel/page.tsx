import { getPersonnel } from "@/app/actions/admin"
import AdminPersonnelClient from "./PersonnelClient"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"

export const metadata = { title: "Personnel | AntiQuake Admin" }

export default async function AdminPersonnelPage() {
  const personnel = await getPersonnel()
  return (
    <>
      <RealtimeRefresh tables={["personnel"]} />
      <AdminPersonnelClient personnel={personnel} />
    </>
  )
}
