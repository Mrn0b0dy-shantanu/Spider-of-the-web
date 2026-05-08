import { getShelters } from "@/app/actions/shelters"
import AdminSheltersClient from "./SheltersClient"

export const metadata = { title: "Shelters | NDC Admin" }

export default async function AdminSheltersPage() {
  const shelters = await getShelters()
  return <AdminSheltersClient shelters={shelters} />
}
