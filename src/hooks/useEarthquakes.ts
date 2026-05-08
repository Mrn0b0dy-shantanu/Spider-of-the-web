import useSWR from 'swr';
import { fetchEarthquakes, EarthquakeResponse } from '@/lib/api/usgs';

export function useEarthquakes(
  range: string, 
  minMagnitude: number,
  location?: { lat: number; lng: number; radiusKm?: number }
) {
  const { data, error, isLoading } = useSWR<EarthquakeResponse>(
    ['earthquakes', range, minMagnitude, location?.lat, location?.lng, location?.radiusKm],
    () => fetchEarthquakes(range, minMagnitude, location),
    {
      refreshInterval: 60000, // Auto refresh every 60 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    earthquakes: data?.features || [],
    isLoading,
    isError: error,
  };
}
