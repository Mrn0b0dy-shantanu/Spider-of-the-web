import { redirect } from "next/navigation"

export default function UserNewsRedirect() {
  redirect("/user/dashboard")
}
