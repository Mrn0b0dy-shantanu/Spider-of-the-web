import { getEmergencyContacts } from "@/app/actions/admin"
import { getAnnouncements } from "@/app/actions/notifications"
import { getShelters } from "@/app/actions/shelters"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"
import UserResourcesClient from "./UserResourcesClient"

export const metadata = { title: "Emergency Resources & Shelters | AntiQuake" }

export default async function UserResourcesPage() {
  const [contacts, announcements, shelters] = await Promise.all([
    getEmergencyContacts(),
    getAnnouncements(),
    getShelters(),
  ])

  return (
    <>
      <RealtimeRefresh tables={["shelters", "announcements", "emergency_contacts"]} />
      <UserResourcesClient
        contacts={contacts}
        announcements={announcements}
        shelters={shelters}
      />
    </>
  )
}
