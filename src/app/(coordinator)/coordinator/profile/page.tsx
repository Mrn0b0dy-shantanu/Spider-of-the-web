import { getProfile } from "@/app/actions/profile"
import { CoordinatorProfileClient } from "./CoordinatorProfileClient"

export const metadata = {
  title: "Profile | Request Coordinator FLARE",
}

export default async function CoordinatorProfilePage() {
  const profile = await getProfile()

  return <CoordinatorProfileClient profile={profile} />
}
