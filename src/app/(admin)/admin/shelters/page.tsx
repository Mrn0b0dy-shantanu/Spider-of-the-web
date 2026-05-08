import { getShelters } from "@/app/actions/shelters"
import AdminSheltersClient from "./SheltersClient"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"

export const metadata = { title: "Shelters | AntiQuake Admin" }

export default async function AdminSheltersPage() {
  const shelters = await getShelters()
  return (
    <>
      <RealtimeRefresh tables={["shelters"]} />
      <AdminSheltersClient shelters={shelters} />
    </>
  )
}
