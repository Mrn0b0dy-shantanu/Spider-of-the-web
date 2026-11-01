import { getUserList } from "@/app/actions/admin"
import AdminUsersClient from "./UsersClient"

export const metadata = { title: "Users | FLARE Admin" }

export default async function AdminUsersPage() {
  const users = await getUserList()
  return <AdminUsersClient users={users} />
}
