import { getSupplies } from "@/app/actions/supplies"
import AdminSuppliesClient from "./SuppliesClient"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"

export const metadata = { title: "Supply Inventory | FLARE Admin" }

export default async function AdminSuppliesPage() {
  const supplies = await getSupplies()
  return (
    <>
      <RealtimeRefresh tables={["supplies"]} />
      <AdminSuppliesClient supplies={supplies} />
    </>
  )
}
