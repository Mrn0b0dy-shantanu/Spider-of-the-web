import { redirect } from "next/navigation"

export default function AdminEarthquakesRedirect() {
  redirect("/admin/incidents")
}
