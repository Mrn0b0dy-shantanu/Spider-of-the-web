import { getProfile } from "@/app/actions/profile"
import UserProfileClient from "./ProfileClient"
import { redirect } from "next/navigation"

export const metadata = { title: "My Profile | NDC Relief" }

export default async function UserProfilePage() {
  const profile = await getProfile()
  
  if (!profile) {
    redirect("/login")
  }

  return <UserProfileClient profile={profile} />
}
