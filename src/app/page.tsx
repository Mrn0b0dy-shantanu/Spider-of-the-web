import { ShieldAlert, ArrowRight, Activity, Users, Globe2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    
    if (profile?.role === "admin") {
      redirect("/admin/dashboard")
    } else {
      redirect("/user/dashboard")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2 font-bold text-xl" href="/">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span>NDC <span className="text-muted-foreground font-medium">ReliefOps</span></span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors mt-2" href="/login">
            Login
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background via-muted/20 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border bg-muted/50 px-3 py-1 text-sm font-medium mb-4">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
                Next-Gen Disaster Management Platform
              </div>
              <h1 className="text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-7xl max-w-3xl">
                Coordinate. Respond. <span className="text-primary">Save Lives.</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl mt-4">
                The modern SaaS platform for national disaster management. Real-time coordination between government agencies and citizens.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button asChild size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/20">
                  <Link href="/signup">
                    Register Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg">
                  <Link href="/login">Portal Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-2xl border bg-background p-8 shadow-sm">
                <div className="p-3 bg-blue-500/10 rounded-xl mb-2">
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">Real-time Ops</h3>
                <p className="text-muted-foreground text-center">Live monitoring of incidents and emergency requests from across the country.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-2xl border bg-background p-8 shadow-sm">
                <div className="p-3 bg-green-500/10 rounded-xl mb-2">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-muted-foreground text-center">Separate, optimized experiences for command center personnel and affected citizens.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-2xl border bg-background p-8 shadow-sm">
                <div className="p-3 bg-red-500/10 rounded-xl mb-2">
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold">Relief Coordination</h3>
                <p className="text-muted-foreground text-center">Efficient supply chain management and shelter occupancy tracking for rapid response.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 NDC ReliefOps. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
