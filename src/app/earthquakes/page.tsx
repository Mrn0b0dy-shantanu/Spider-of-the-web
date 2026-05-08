"use client";

import { useState, useEffect, useCallback } from "react";
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
  loading: () => <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg animate-pulse"><Activity className="h-8 w-8 text-muted-foreground animate-spin" /></div>
});

export default function EarthquakeRadar() {
  const [range, setRange] = useState("day");
  const [minMagnitude, setMinMagnitude] = useState([2.5]);
  const [selectedEq, setSelectedEq] = useState<EarthquakeFeature | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, radiusKm?: number} | undefined>();
  const [isLocating, setIsLocating] = useState(false);

  const { earthquakes, isLoading, isError } = useEarthquakes(range, minMagnitude[0], userLocation);

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
    // Auto-locate on initial load if location isn't set yet
    if (!userLocation && !isLocating) {
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
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Globe2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Earthquake Radar</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="range-select" className="text-sm font-medium">Time Range:</Label>
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
              <Label className="text-sm font-medium whitespace-nowrap">Min Mag: {minMagnitude[0]}</Label>
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
              <MapPin className="h-4 w-4 mr-2" />
              {isLocating ? "Locating..." : userLocation ? "Global" : "Near Me"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Mobile Filter Controls (Visible only on small screens) */}
        <div className="md:hidden flex flex-col gap-4 p-4 border-b absolute z-10 bg-background/95 backdrop-blur w-full">
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
             <Label className="text-sm font-medium whitespace-nowrap">Min Mag: {minMagnitude[0]}</Label>
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
            <MapPin className="h-4 w-4 mr-2" />
            {isLocating ? "Locating..." : userLocation ? "Switch to Global" : "Near Me"}
          </Button>
        </div>

        {/* Map Area (70%) */}
        <div className="relative flex-1 md:w-[70%] h-full p-0 z-0">
          {isError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center text-destructive">
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
          <div className="md:hidden absolute bottom-6 right-6 z-10">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" aria-label="Open Earthquake Feed">
                  <List className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] flex flex-col p-0 rounded-t-xl">
                <SheetHeader className="p-4 border-b text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
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
        <div className="hidden md:flex w-[30%] h-full flex-col border-l bg-card">
          <div className="p-4 border-b bg-muted/20">
            <h2 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Latest Earthquakes ({earthquakes.length})
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Live updates every 60s</p>
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
