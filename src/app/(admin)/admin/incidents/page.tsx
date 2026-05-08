import { getIncidents } from "@/app/actions/admin"
import AdminIncidentsClient from "./IncidentsClient"
import { fetchEarthquakes } from "@/lib/api/usgs"
import { RealtimeRefresh } from "@/components/shared/RealtimeRefresh"

export const metadata = { title: "Incidents | AntiQuake Admin" }

export default async function AdminIncidentsPage() {
  const [supabaseIncidents, usgsData] = await Promise.all([
    getIncidents(),
    fetchEarthquakes("day", 3.0)
  ])


  const mappedUsgs = usgsData.features.map(feature => {
    const sbIncident = supabaseIncidents.find(inc => inc.id === feature.id)


    const mag = feature.properties.mag
    let severity = "minor"
    if (mag >= 7.0) severity = "catastrophic"
    else if (mag >= 6.0) severity = "severe"
    else if (mag >= 4.5) severity = "moderate"

    return {
      id: feature.id,
      name: feature.properties.title || `Earthquake: ${feature.properties.place}`,
      type: "Earthquake",
      location: feature.properties.place,
      severity,
      affected_population: sbIncident?.affected_population || Math.floor(Math.random() * 1000),
      status: sbIncident?.status || "monitoring",
      created_at: new Date(feature.properties.time).toISOString()
    }
  })

  return (
    <>
      <RealtimeRefresh tables={["incidents"]} />
      <AdminIncidentsClient incidents={mappedUsgs} />
    </>
  )
}
