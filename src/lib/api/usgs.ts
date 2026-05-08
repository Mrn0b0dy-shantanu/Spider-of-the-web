export interface EarthquakeProperties {
  mag: number;
  place: string;
  time: number;
  updated: number;
  tz: number | null;
  url: string;
  detail: string;
  felt: number | null;
  cdi: number | null;
  mmi: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  net: string;
  code: string;
  ids: string;
  sources: string;
  types: string;
  nst: number | null;
  dmin: number | null;
  rms: number | null;
  gap: number | null;
  magType: string;
  type: string;
  title: string;
}

export interface EarthquakeGeometry {
  type: "Point";
  coordinates: [number, number, number];
}

export interface EarthquakeFeature {
  type: "Feature";
  properties: EarthquakeProperties;
  geometry: EarthquakeGeometry;
  id: string;
}

export interface EarthquakeResponse {
  type: "FeatureCollection";
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
}

export const fetchEarthquakes = async (
  range: string,
  minMagnitude: number,
  location?: { lat: number; lng: number; radiusKm?: number }
): Promise<EarthquakeResponse> => {
  const endtime = new Date().toISOString();
  let starttime = new Date();

  if (range === "hour") {
    starttime.setHours(starttime.getHours() - 1);
  } else if (range === "day") {
    starttime.setDate(starttime.getDate() - 1);
  } else if (range === "week") {
    starttime.setDate(starttime.getDate() - 7);
  }

  const url = new URL("https://earthquake.usgs.gov/fdsnws/event/1/query");
  url.searchParams.append("format", "geojson");
  url.searchParams.append("starttime", starttime.toISOString());
  url.searchParams.append("endtime", endtime);
  url.searchParams.append("minmagnitude", minMagnitude.toString());

  if (location) {
    url.searchParams.append("latitude", location.lat.toString());
    url.searchParams.append("longitude", location.lng.toString());
    url.searchParams.append("maxradiuskm", (location.radiusKm || 2000).toString());
  } else {
    url.searchParams.append("orderby", "time");
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch earthquake data");
  }

  return response.json();
};
