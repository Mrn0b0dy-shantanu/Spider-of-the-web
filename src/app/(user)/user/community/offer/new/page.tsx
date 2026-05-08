
import { CreateOfferForm } from "@/components/community/CreateOfferForm"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = { title: "Share Help Resources | AntiQuake" }

export default function NewOfferPage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="-ml-2 gap-2 text-muted-foreground hover:text-primary">
        <Link href="/user/community?tab=offers">
          <ChevronLeft className="w-4 h-4" /> Back to Aid Network
        </Link>
      </Button>

      <CreateOfferForm />
    </div>
  )
}
