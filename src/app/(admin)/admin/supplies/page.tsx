import { getSupplies } from "@/app/actions/supplies"
import AdminSuppliesClient from "./SuppliesClient"

export const metadata = { title: "Supply Inventory | NDC Admin" }

export default async function AdminSuppliesPage() {
  const supplies = await getSupplies()
  return <AdminSuppliesClient supplies={supplies} />
}
