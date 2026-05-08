import { getOrganizations } from "@/app/actions/admin"
import AdminOrganizationsClient from "./OrganizationsClient"

export const metadata = { title: "Organizations | NDC Admin" }

export default async function AdminOrganizationsPage() {
  const organizations = await getOrganizations()
  return <AdminOrganizationsClient organizations={organizations} />
}
