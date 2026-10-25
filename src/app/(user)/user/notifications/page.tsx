import { redirect } from "next/navigation"

export default function UserNotificationsRedirect() {
  redirect("/user/dashboard")
}
