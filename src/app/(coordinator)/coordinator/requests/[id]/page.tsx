import { getCoordinatorRequestDetail } from "@/app/actions/coordinator"
import { CoordinatorRequestDetailClient } from "./CoordinatorRequestDetailClient"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Request Details | Request Coordinator AntiQuake",
}

export default async function CoordinatorRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  const request = await getCoordinatorRequestDetail(resolvedParams.id)

  if (!request) {
    notFound()
  }

  return <CoordinatorRequestDetailClient request={request} />
}
