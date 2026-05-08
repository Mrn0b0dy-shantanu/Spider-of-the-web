"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { EarthquakeFeature } from "@/lib/api/usgs";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Fix for default marker icon in Leaflet with webpack/nextjs
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface MapProps {
  earthquakes: EarthquakeFeature[];
  selectedEarthquake: EarthquakeFeature | null;
  onSelectEarthquake: (eq: EarthquakeFeature) => void;
  userLocation?: { lat: number, lng: number, radiusKm?: number };
}

const getMagnitudeColor = (mag: number) => {
  if (mag < 3) return "#22c55e"; // green-500
  if (mag < 5) return "#eab308"; // yellow-500
  if (mag < 7) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
};

// Component to handle map flying to selected marker or user location
const MapFlyTo = ({ selectedEarthquake, userLocation }: { selectedEarthquake: EarthquakeFeature | null, userLocation?: { lat: number, lng: number } }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedEarthquake) {
      const [lng, lat] = selectedEarthquake.geometry.coordinates;
      map.flyTo([lat, lng], 8, { duration: 1.5 });
    } else if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 4, { duration: 1.5 });
    }
  }, [selectedEarthquake, userLocation, map]);
  return null;
};

export default function Map({ earthquakes, selectedEarthquake, onSelectEarthquake, userLocation }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-lg">Loading Map...</div>;
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="w-full h-full rounded-lg z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />
      
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={40}
      >
        {earthquakes.map((eq) => {
        const [lng, lat] = eq.geometry.coordinates;
        const mag = eq.properties.mag;
        const color = getMagnitudeColor(mag);
        
        return (
          <CircleMarker
            key={eq.id}
            center={[lat, lng]}
            radius={Math.max(mag * 2.5, 4)}
            pathOptions={{
              fillColor: color,
              color: "#ffffff",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.7,
            }}
            eventHandlers={{
              click: () => onSelectEarthquake(eq),
            }}
          >
            <Popup>
              <div className="font-sans flex flex-col gap-1 min-w-[200px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">M {mag.toFixed(1)}</span>
                  <Badge style={{ backgroundColor: color }} className="text-white">
                    {mag >= 7 ? 'Major' : mag >= 5 ? 'Strong' : mag >= 3 ? 'Light' : 'Minor'}
                  </Badge>
                </div>
                <p className="font-medium text-sm mt-1">{eq.properties.place}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(eq.properties.time), "MMM d, yyyy HH:mm:ss")}
                </p>
                <a 
                  href={eq.properties.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                >
                  View on USGS
                </a>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
      </MarkerClusterGroup>
      
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={icon}>
          <Popup>
            <div className="font-sans font-medium text-center">Your Location<br/>Showing earthquakes within {userLocation.radiusKm || 2000}km</div>
          </Popup>
        </Marker>
      )}

      <MapFlyTo selectedEarthquake={selectedEarthquake} userLocation={userLocation} />
    </MapContainer>
  );
}
