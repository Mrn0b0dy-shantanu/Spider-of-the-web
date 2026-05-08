import { getAnnouncements } from "@/app/actions/notifications"
import AdminNotificationsClient from "./NotificationsClient"

export const metadata = { title: "Announcements | NDC Admin" }

export default async function AdminNotificationsPage() {
  const announcements = await getAnnouncements()
  return <AdminNotificationsClient announcements={announcements} />
}
