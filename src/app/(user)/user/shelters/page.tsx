import { getShelters } from "@/app/actions/shelters"
import UserSheltersClient from "./SheltersClient"

export const metadata = { title: "Shelters | NDC Relief" }

export default async function UserSheltersPage() {
  const shelters = await getShelters()
  return <UserSheltersClient shelters={shelters} />
}
