import { redirect } from "next/navigation"

export default function AdminNewsRedirect() {
  redirect("/admin/dashboard")
}
