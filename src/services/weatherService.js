import { REGIONS_DATA } from '../data/farmingData.js';

const CACHE_PREFIX = 'tantsaha_cached_weather_';
const LAST_COORDS_KEY = 'tantsaha_last_coords';

/**
 * Get current browser GPS coordinates with promise wrapper
 */
export function getCurrentCoordinates() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Tsy manohana GPS ny fitaovanao / Géolocalisation non supportée'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        try {
          localStorage.setItem(LAST_COORDS_KEY, JSON.stringify(coords));
        } catch {
          // ignore
        }
        resolve(coords);
      },
      (error) => {
        let msg = 'Tsy nahazoana alalana ny GPS';
        if (error.code === 1) {
          msg = 'Nolavina ny fahazoan-dalana GPS / Accès GPS refusé';
        } else if (error.code === 2) {
          msg = 'Tsy hita ny toerana misy anao / Position indisponible';
        } else if (error.code === 3) {
          msg = 'Lany fe-potoana ny fangatahana GPS / Délai d\'attente GPS dépassé';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10 * 60 * 1000, // 10 minutes cache
      }
    );
  });
}

/**
 * Get saved last coordinates if available
 */
export function getLastSavedCoordinates() {
  try {
    const raw = localStorage.getItem(LAST_COORDS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Fetch live weather by GPS coordinates
 */
export async function fetchLiveWeatherByCoords(lat, lon) {
  const cacheKey = `gps_${Math.round(lat * 100) / 100}_${Math.round(lon * 100) / 100}`;
  const defaultFallback = REGIONS_DATA[0];

  try {
    const res = await fetch(
      `/api/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`,
      {
        headers: { Accept: 'application/json' },
      }
    );

    if (!res.ok) {
      throw new Error(`Erreur serveur (${res.status})`);
    }

    const data = await res.json();
    if (data && data.today) {
      try {
        localStorage.setItem(
          CACHE_PREFIX + cacheKey,
          JSON.stringify({ data, savedAt: Date.now() })
        );
        // Also save as primary GPS cache
        localStorage.setItem(
          CACHE_PREFIX + 'gps_latest',
          JSON.stringify({ data, savedAt: Date.now() })
        );
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return { weather: data, isLive: true };
    }
    throw new Error('Données météo GPS invalides reçues');
  } catch (err) {
    // Check cached GPS weather
    try {
      const cachedStr =
        localStorage.getItem(CACHE_PREFIX + cacheKey) ||
        localStorage.getItem(CACHE_PREFIX + 'gps_latest');
      if (cachedStr) {
        const parsed = JSON.parse(cachedStr);
        if (parsed.data) {
          return {
            weather: {
              ...parsed.data,
              isLive: false,
              lastUpdated: `${parsed.data.lastUpdated || 'Tehiry taloha'} (Hors-ligne)`,
            },
            isLive: false,
          };
        }
      }
    } catch {
      // ignore
    }

    return {
      weather: {
        ...defaultFallback,
        id: 'gps_current',
        nameMg: 'Toerana misy anao (GPS)',
        nameFr: 'Votre position (GPS)',
        isLive: false,
        lastUpdated: 'Toetrandro ifotony (Hors-ligne)',
      },
      isLive: false,
      error: err.message,
    };
  }
}

/**
 * Fetch live weather by region ID
 */
export async function fetchLiveRegionWeather(regionId) {
  const fallback =
    REGIONS_DATA.find((r) => r.id === regionId) || REGIONS_DATA[0];

  try {
    const res = await fetch(`/api/weather?region=${encodeURIComponent(regionId)}`, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Erreur serveur (${res.status})`);
    }

    const data = await res.json();
    if (data && data.today) {
      try {
        localStorage.setItem(
          CACHE_PREFIX + regionId,
          JSON.stringify({ data, savedAt: Date.now() })
        );
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return { weather: data, isLive: true };
    }
    throw new Error('Données météo invalides reçues');
  } catch (err) {
    try {
      const cachedStr = localStorage.getItem(CACHE_PREFIX + regionId);
      if (cachedStr) {
        const parsed = JSON.parse(cachedStr);
        if (parsed.data) {
          return {
            weather: {
              ...parsed.data,
              isLive: false,
              lastUpdated: `${parsed.data.lastUpdated || 'Tehiry taloha'} (Hors-ligne)`,
            },
            isLive: false,
          };
        }
      }
    } catch {
      // ignore
    }

    return {
      weather: { ...fallback, isLive: false, lastUpdated: 'Toetrandro ifotony (Hors-ligne)' },
      isLive: false,
      error: err.message,
    };
  }
}
