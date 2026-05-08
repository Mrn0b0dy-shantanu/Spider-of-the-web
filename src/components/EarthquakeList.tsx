"use client";

import { EarthquakeFeature } from "@/lib/api/usgs";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EarthquakeListProps {
  earthquakes: EarthquakeFeature[];
  onSelectEarthquake: (eq: EarthquakeFeature) => void;
  selectedEarthquakeId?: string;
  isLoading: boolean;
  userLocation?: { lat: number; lng: number };
}


const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p) / 2 +
    c(lat1 * p) * c(lat2 * p) *
    (1 - c((lon2 - lon1) * p)) / 2;
  return 12742 * Math.asin(Math.sqrt(a));
};

const getMagnitudeColor = (mag: number) => {
  if (mag < 3) return "bg-green-500/10 text-green-500 border-green-500/20";
  if (mag < 5) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  if (mag < 7) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  return "bg-red-500/10 text-red-500 border-red-500/20";
};

export default function EarthquakeList({
  earthquakes,
  onSelectEarthquake,
  selectedEarthquakeId,
  isLoading,
  userLocation
}: EarthquakeListProps) {

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="bg-muted/40 p-4 h-24" />
          </Card>
        ))}
      </div>
    );
  }

  if (earthquakes.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center p-4 h-48 text-muted-foreground text-center">
        <Activity className="opacity-20 mb-2 w-8 h-8" />
        <p>No earthquakes found for the selected criteria.</p>
      </div>
    );
  }


  const sortedEarthquakes = userLocation
    ? [...earthquakes].sort((a, b) => {
      const distA = getDistance(userLocation.lat, userLocation.lng, a.geometry.coordinates[1], a.geometry.coordinates[0]);
      const distB = getDistance(userLocation.lat, userLocation.lng, b.geometry.coordinates[1], b.geometry.coordinates[0]);
      return distA - distB;
    })
    : earthquakes;

  return (
    <div className="space-y-3 p-4 h-full overflow-y-auto">
      {sortedEarthquakes.map((eq) => {
        const mag = eq.properties.mag;
        const colorClass = getMagnitudeColor(mag);
        const isSelected = selectedEarthquakeId === eq.id;

        let distanceText = "";
        if (userLocation) {
          const dist = getDistance(userLocation.lat, userLocation.lng, eq.geometry.coordinates[1], eq.geometry.coordinates[0]);
          distanceText = `${Math.round(dist)}km away`;
        }

        return (
          <Card
            key={eq.id}
            className={`cursor-pointer transition-all hover:bg-accent/50 ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}
            onClick={() => onSelectEarthquake(eq)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex items-center justify-center h-12 w-12 rounded-full border ${colorClass} font-bold text-lg`}>
                {mag.toFixed(1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" title={eq.properties.place}>
                  {eq.properties.place}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-muted-foreground text-xs">
                  <span>{format(new Date(eq.properties.time), "MMM d, HH:mm")}</span>
                  <span>•</span>
                  <span>{eq.geometry.coordinates[2].toFixed(1)} km depth</span>
                  {distanceText && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-primary">{distanceText}</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
