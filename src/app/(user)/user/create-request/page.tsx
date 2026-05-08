import { getCategories } from "@/app/actions/requests"
import CreateRequestClient from "./CreateRequestClient"

export const metadata = { title: "Create Request | AntiQuake" }

export default async function CreateRequestPage() {
  const categories = await getCategories()
  return <CreateRequestClient categories={categories} />
}
