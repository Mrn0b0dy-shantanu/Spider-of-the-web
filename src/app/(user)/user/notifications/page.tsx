import { getNotifications } from "@/app/actions/notifications"
import UserNotificationsClient from "./NotificationsClient"

export const metadata = { title: "Notifications | AntiQuake" }

export default async function UserNotificationsPage() {
  const notifications = await getNotifications()
  return <UserNotificationsClient notifications={notifications} />
}
