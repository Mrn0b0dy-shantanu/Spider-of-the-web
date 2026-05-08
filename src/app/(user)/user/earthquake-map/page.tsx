"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import { EarthquakeFeature } from "@/lib/api/usgs";
import EarthquakeList from "@/components/EarthquakeList";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Activity, Globe2, Filter, List, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

// Dynamically import Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center bg-muted/50 rounded-lg w-full h-full animate-pulse"><Activity className="w-8 h-8 text-muted-foreground animate-spin" /></div>
});

export default function EarthquakeRadar() {
  const [range, setRange] = useState("day");
  const [minMagnitude, setMinMagnitude] = useState([2.5]);
  const [selectedEq, setSelectedEq] = useState<EarthquakeFeature | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number, radiusKm?: number } | undefined>();
  const [isLocating, setIsLocating] = useState(false);

  const searchParams = useSearchParams();
  const eqId = searchParams.get("id");

  const { earthquakes, isLoading, isError } = useEarthquakes(range, minMagnitude[0], userLocation);

  useEffect(() => {
    if (eqId && earthquakes.length > 0) {
      const eq = earthquakes.find(e => e.id === eqId);
      if (eq) setSelectedEq(eq);
    }
  }, [eqId, earthquakes]);

  const handleLocateMe = useCallback(() => {
    if (userLocation) {
      setUserLocation(undefined);
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, radiusKm: 2000 });
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        // Only alert if they manually clicked the button, not on auto-load
        // alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      }
    );
  }, [userLocation]);

  useEffect(() => {
    // Auto-locate on initial load if location isn't set yet and NO specific earthquake ID is targeted
    if (!userLocation && !isLocating && !eqId) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, radiusKm: 2000 });
          setIsLocating(false);
        },
        (err) => {
          console.error("Initial geolocation failed:", err);
          setIsLocating(false);
        }
      );
    }
  }, []); // Run once on mount

  return (
    <div className="flex flex-col bg-background w-full h-screen overflow-hidden">
      <header className="flex justify-end items-center px-6 border-b h-16 shrink-0">
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="range-select" className="font-medium text-sm">Time Range:</Label>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger id="range-select" className="w-[140px]">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Past Hour</SelectItem>
                  <SelectItem value="day">Past Day</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 w-[150px]">
              <Label className="font-medium text-sm whitespace-nowrap">Min Mag: {minMagnitude[0]}</Label>
              <Slider
                value={minMagnitude}
                onValueChange={setMinMagnitude}
                max={9}
                step={0.5}
                className="flex-1"
              />
            </div>

            <Button
              variant={userLocation ? "default" : "outline"}
              size="sm"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="ml-2"
            >
              <MapPin className="mr-2 w-4 h-4" />
              {isLocating ? "Locating..." : userLocation ? "Global" : "Near Me"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Mobile Filter Controls (Visible only on small screens) */}
        <div className="md:hidden z-10 absolute flex flex-col gap-4 bg-background/95 backdrop-blur p-4 border-b w-full">
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Past Hour</SelectItem>
                <SelectItem value="day">Past Day</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Label className="font-medium text-sm whitespace-nowrap">Min Mag: {minMagnitude[0]}</Label>
            <Slider
              value={minMagnitude}
              onValueChange={setMinMagnitude}
              max={9}
              step={0.5}
              className="flex-1"
            />
          </div>
          <Button
            variant={userLocation ? "default" : "outline"}
            size="sm"
            onClick={handleLocateMe}
            disabled={isLocating}
            className="w-full"
          >
            <MapPin className="mr-2 w-4 h-4" />
            {isLocating ? "Locating..." : userLocation ? "Switch to Global" : "Near Me"}
          </Button>
        </div>

        {/* Map Area (70%) */}
        <div className="z-0 relative flex-1 p-0 md:w-[70%] h-full">
          {isError && (
            <div className="z-10 absolute inset-0 flex justify-center items-center bg-background/80">
              <div className="text-destructive text-center">
                <p>Failed to load earthquake data.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </div>
          )}
          <MapWithNoSSR
            earthquakes={earthquakes}
            selectedEarthquake={selectedEq}
            onSelectEarthquake={setSelectedEq}
            userLocation={userLocation}
          />

          {/* Mobile Floating Action Button for Feed */}
          <div className="md:hidden right-6 bottom-6 z-10 absolute">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="shadow-lg rounded-full w-14 h-14" aria-label="Open Earthquake Feed">
                  <List className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="flex flex-col p-0 rounded-t-xl h-[80vh]">
                <SheetHeader className="p-4 border-b text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Latest Earthquakes ({earthquakes.length})
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                  <EarthquakeList
                    earthquakes={earthquakes}
                    onSelectEarthquake={(eq) => {
                      setSelectedEq(eq);
                      // In a real app we might want to auto-close or leave open
                    }}
                    selectedEarthquakeId={selectedEq?.id}
                    isLoading={isLoading}
                    userLocation={userLocation}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Sidebar Feed (30%) */}
        <div className="hidden md:flex flex-col bg-card border-l w-[30%] h-full">
          <div className="bg-muted/20 p-4 border-b">
            <h2 className="flex items-center gap-2 font-semibold">
              <Activity className="w-4 h-4" />
              Latest Earthquakes ({earthquakes.length})
            </h2>
            <p className="mt-1 text-muted-foreground text-xs">Live updates every 60s</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <EarthquakeList
              earthquakes={earthquakes}
              onSelectEarthquake={setSelectedEq}
              selectedEarthquakeId={selectedEq?.id}
              isLoading={isLoading}
              userLocation={userLocation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
