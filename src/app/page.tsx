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
      <header className="top-0 z-50 sticky flex items-center bg-background/80 backdrop-blur-sm px-4 lg:px-6 border-b h-16">
        <Link className="flex justify-center items-center gap-2 font-bold text-xl" href="/">
          <ShieldAlert className="w-6 h-6 text-primary" />
          <span>Anti<span className="font-medium text-muted-foreground">Quake</span></span>
        </Link>
        <nav className="flex gap-4 sm:gap-6 ml-auto">
          <Link className="mt-2 font-medium hover:text-primary text-sm transition-colors" href="/login">
            Login
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-background via-muted/20 to-background py-12 md:py-24 lg:py-32 xl:py-48 w-full">
          <div className="px-4 md:px-6 container">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex items-center bg-muted/50 mb-4 px-3 py-1 border rounded-full font-medium text-sm">
                <span className="flex bg-primary mr-2 rounded-full w-2 h-2" />
                Next-Gen Disaster Management Platform
              </div>
              <h1 className="max-w-3xl font-black text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tighter">
                Coordinate. Respond. <span className="text-primary">Save Lives.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl">
                The modern SaaS platform for national disaster management. Real-time coordination between government agencies and citizens.
              </p>
              <div className="flex sm:flex-row flex-col gap-4 mt-8">
                <Button asChild size="lg" className="shadow-primary/20 shadow-xl px-8 h-12 text-lg">
                  <Link href="/signup">
                    Register Now <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 h-12 text-lg">
                  <Link href="/login">Portal Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-12 md:py-24 lg:py-32 w-full">
          <div className="px-4 md:px-6 container">
            <div className="gap-8 grid sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 bg-background shadow-sm p-8 border rounded-2xl">
                <div className="bg-blue-500/10 mb-2 p-3 rounded-xl">
                  <Activity className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-bold text-xl">Real-time Ops</h3>
                <p className="text-muted-foreground text-center">Live monitoring of incidents and emergency requests from across the country.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-background shadow-sm p-8 border rounded-2xl">
                <div className="bg-green-500/10 mb-2 p-3 rounded-xl">
                  <Users className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-xl">Role-Based Access</h3>
                <p className="text-muted-foreground text-center">Separate, optimized experiences for command center personnel and affected citizens.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-background shadow-sm p-8 border rounded-2xl">
                <div className="bg-red-500/10 mb-2 p-3 rounded-xl">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-bold text-xl">Relief Coordination</h3>
                <p className="text-muted-foreground text-center">Efficient supply chain management and shelter occupancy tracking for rapid response.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex sm:flex-row flex-col items-center gap-2 px-4 md:px-6 py-6 border-t w-full shrink-0">
        <p className="text-muted-foreground text-xs">© 2024 AntiQuake. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6 sm:ml-auto">
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
