import { getPersonnel, getOrganizations } from "@/app/actions/admin"
import AdminPersonnelAndPartnersClient from "./PersonnelClient"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"

export const metadata = { title: "Personnel & Partner Organizations | AntiQuake Admin" }

export default async function AdminPersonnelPage() {
  const [personnel, organizations] = await Promise.all([
    getPersonnel(),
    getOrganizations(),
  ])

  return (
    <>
      <RealtimeRefresh tables={["personnel", "organizations"]} />
      <AdminPersonnelAndPartnersClient
        personnel={personnel}
        organizations={organizations}
      />
    </>
  )
}
