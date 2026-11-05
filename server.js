import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const OPENWEATHER_API_KEY =
  process.env.OPENWEATHER_API_KEY || '8ece38b6e1541abd23d294446407d466';

app.use(express.json());

// Enable CORS so localhost requests are never blocked
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory weather cache (15 minutes TTL)
const weatherCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

const REGION_COORDS = {
  ambatondrazaka: {
    id: 'ambatondrazaka',
    lat: -17.83,
    lon: 48.42,
    nameMg: 'Alaotra-Mangoro (Ambatondrazaka)',
    nameFr: 'Alaotra-Mangoro (Ambatondrazaka)',
    description: 'Renivohitry ny vary eto Madagasikara / Grenier à riz national',
    granaryType: 'Lemaka fambolen-driz midadasika',
  },
  antsirabe: {
    id: 'antsirabe',
    lat: -19.87,
    lon: 47.03,
    nameMg: 'Vakinankaratra (Antsirabe)',
    nameFr: 'Vakinankaratra (Antsirabe)',
    description: 'Lemaka avo fambolena legioma, ovy, voatabia sy katsaka',
    granaryType: 'Fambolena legioma sy tantsaha marolafy',
  },
  analamanga: {
    id: 'analamanga',
    lat: -18.91,
    lon: 47.53,
    nameMg: 'Analamanga (Antananarivo)',
    nameFr: 'Analamanga (Antananarivo)',
    description: 'Lemaka manodidina sy tany maro anaka',
    granaryType: 'Tanimbary sy fambolena an-tanàna',
  },
  fianarantsoa: {
    id: 'fianarantsoa',
    lat: -21.45,
    lon: 47.08,
    nameMg: 'Matsiatra Ambony (Fianarantsoa)',
    nameFr: 'Matsiatra Ambony (Fianarantsoa)',
    description: 'Tanimbary am-patana sy fambolena voaloboka, dite, vary',
    granaryType: 'Tanimbary tohatra sy havoana',
  },
};

function mapWeatherCondition(main, clouds = 0) {
  const m = (main || '').toLowerCase();
  if (m.includes('thunder') || m.includes('storm')) return 'storm';
  if (m.includes('rain') || m.includes('drizzle')) return 'rainy';
  if (m.includes('clear')) return 'sunny';
  if (clouds > 70) return 'cloudy';
  return 'partlyCloudy';
}

function getDayNameMg(date) {
  const days = ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Sabotsy'];
  return days[date.getDay()];
}

function getDayNameFr(date) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[date.getDay()];
}

function generateAgriculturalAdvice(condition, tempMax, tempMin, rainChance, humidity) {
  let adviceMg = '';
  let adviceFr = '';

  if (condition === 'storm') {
    adviceMg = 'Tandremo ny oram-baratra sy tselatra: aza miasa an-tanimbary, arovana ny biby fiompy.';
    adviceFr = 'Orages et rafales violentes : évitez les travaux dans les rizières inondables.';
  } else if (condition === 'rainy' || rainChance >= 60) {
    adviceMg = 'Misy orana malefaka: fotoana tena tsara hanondrahana ny tanimbary sy hanomanana ny zana-ketsa. Aza manipy fanafody amin\'ny ravina.';
    adviceFr = 'Pluie prévue : favorable à l’irrigation des parcelles de riz, reporter les pulvérisations foliaires.';
  } else if (tempMin <= 12 && humidity >= 70) {
    adviceMg = 'Hatsiaka maraina sy hamandoana be: tandremo ny aretina bobongolo (mildiou) amin\'ny voatabia sy ovy. Afafazo lavenona.';
    adviceFr = 'Fraîcheur matinale et forte humidité : risque de mildiou sur tomates et pommes de terre. Traiter préventivement.';
  } else if (tempMax >= 28 && condition === 'sunny') {
    adviceMg = 'Masoandro mamiratra sy hafanana tsara: mety tsara hanamainana voa, fijinjana, ary fanalana ahi-dratsy.';
    adviceFr = 'Plein soleil et chaleur : idéal pour le séchage des grains, désherbage et récoltes à maturité.';
  } else {
    adviceMg = 'Toetrandro malefaka: mety tsara amin\'ny fambolena legioma, fanondrahana ary fanaraha-maso ny fahasalaman\'ny voly.';
    adviceFr = 'Climat doux et stable : propice au repiquage maraîcher, sarclage et arrosage régulier.';
  }

  return { adviceMg, adviceFr };
}

// Weather Proxy Route with region or GPS coordinates support
app.get('/api/weather', async (req, res) => {
  try {
    const rawLat = req.query.lat;
    const rawLon = req.query.lon;
    const hasLat = rawLat !== undefined && rawLat !== null && String(rawLat).trim() !== '';
    const hasLon = rawLon !== undefined && rawLon !== null && String(rawLon).trim() !== '';

    const latParam = hasLat ? parseFloat(rawLat) : NaN;
    const lonParam = hasLon ? parseFloat(rawLon) : NaN;

    const isCustomCoords =
      Number.isFinite(latParam) &&
      Number.isFinite(lonParam) &&
      latParam >= -90 &&
      latParam <= 90 &&
      lonParam >= -180 &&
      lonParam <= 180;

    let region;
    let cacheKey;

    if (isCustomCoords) {
      // Rounded to 2 decimal places (~1km) for effective caching
      const roundedLat = Math.round(latParam * 100) / 100;
      const roundedLon = Math.round(lonParam * 100) / 100;
      cacheKey = `weather_geo_${roundedLat}_${roundedLon}`;
      region = {
        id: 'gps_current',
        lat: latParam,
        lon: lonParam,
        nameMg: 'Toerana misy anao (GPS)',
        nameFr: 'Votre position (GPS)',
        description: 'Toetrandro miorina amin\'ny GPS misy anao izao',
        granaryType: 'Toerana ara-jeografika misy anao',
        isGps: true,
      };
    } else {
      const regionId = ((req.query.region) || 'ambatondrazaka').toLowerCase();
      region = REGION_COORDS[regionId] || REGION_COORDS['ambatondrazaka'];
      cacheKey = `weather_${region.id}`;
    }

    const cached = weatherCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      res.json(cached.data);
      return;
    }

    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${region.lat}&lon=${region.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${region.lat}&lon=${region.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=fr`
      ),
    ]);

    if (!currentRes.ok) {
      throw new Error(`OpenWeather current API error: ${currentRes.statusText}`);
    }

    const currentData = await currentRes.json();
    const forecastData = forecastRes.ok ? await forecastRes.json() : null;

    // If custom GPS, personalize region name with detected city/locality
    if (isCustomCoords && currentData.name) {
      const cityName = currentData.name;
      const country = currentData.sys?.country || 'MG';
      region.nameMg = `${cityName} (${country === 'MG' ? 'Toerana misy anao' : country})`;
      region.nameFr = `${cityName} (${country === 'MG' ? 'Votre position' : country})`;
      region.cityName = cityName;
    }

    // Process Today's weather
    const now = new Date();
    const condition = mapWeatherCondition(
      currentData.weather?.[0]?.main || '',
      currentData.clouds?.all || 0
    );
    const tempMax = Math.round(currentData.main?.temp_max ?? currentData.main?.temp ?? 25);
    const tempMin = Math.round(currentData.main?.temp_min ?? tempMax - 6);
    const humidity = Math.round(currentData.main?.humidity ?? 65);
    const windSpeed = Math.round((currentData.wind?.speed ?? 3) * 3.6);

    let rainChance = Math.min(
      100,
      Math.max(
        10,
        condition === 'rainy' ? 85 : condition === 'storm' ? 95 : Math.round((currentData.clouds?.all || 20) * 0.7)
      )
    );

    const { adviceMg, adviceFr } = generateAgriculturalAdvice(
      condition,
      tempMax,
      tempMin,
      rainChance,
      humidity
    );

    const todayWeather = {
      date: now.toISOString().split('T')[0],
      dayNameMg: getDayNameMg(now),
      dayNameFr: getDayNameFr(now),
      condition,
      tempMax,
      tempMin,
      rainChance,
      humidity,
      windSpeed,
      farmingAdviceMg: adviceMg,
      farmingAdviceFr: adviceFr,
      audioTextMg: `Toetrandro mivantana ao ${region.nameMg.split('(')[1]?.replace(')', '') || region.nameMg}. Hafanana ${tempMax} degre. Hamandoana ${humidity} isan-jato. ${adviceMg}`,
    };

    // Process Forecast days
    const dailyMap = new Map();
    const todayStr = now.toISOString().split('T')[0];

    if (forecastData && Array.isArray(forecastData.list)) {
      for (const item of forecastData.list) {
        const itemDateStr = item.dt_txt?.split(' ')[0];
        if (itemDateStr && itemDateStr !== todayStr) {
          if (!dailyMap.has(itemDateStr)) {
            dailyMap.set(itemDateStr, []);
          }
          dailyMap.get(itemDateStr).push(item);
        }
      }
    }

    const forecastDays = [];
    const sortedDates = Array.from(dailyMap.keys()).slice(0, 3);

    for (const dStr of sortedDates) {
      const items = dailyMap.get(dStr);
      const dObj = new Date(dStr + 'T12:00:00Z');
      let maxT = -999;
      let minT = 999;
      let sumClouds = 0;
      let maxPop = 0;
      let dominantWeather = 'Clouds';

      for (const it of items) {
        const t = it.main?.temp ?? 20;
        if (t > maxT) maxT = t;
        if (t < minT) minT = t;
        sumClouds += it.clouds?.all || 0;
        if ((it.pop || 0) > maxPop) maxPop = it.pop;
        if (it.weather?.[0]?.main === 'Rain' || it.weather?.[0]?.main === 'Thunderstorm') {
          dominantWeather = it.weather[0].main;
        }
      }

      const fCondition = mapWeatherCondition(dominantWeather, Math.round(sumClouds / items.length));
      const fTempMax = Math.round(maxT);
      const fTempMin = Math.round(minT);
      const fRainChance = Math.round(maxPop * 100);
      const fAdvice = generateAgriculturalAdvice(fCondition, fTempMax, fTempMin, fRainChance, 65);

      forecastDays.push({
        date: dStr,
        dayNameMg: getDayNameMg(dObj),
        dayNameFr: getDayNameFr(dObj),
        condition: fCondition,
        tempMax: fTempMax,
        tempMin: fTempMin,
        rainChance: fRainChance,
        humidity: 68,
        windSpeed: 12,
        farmingAdviceMg: fAdvice.adviceMg,
        farmingAdviceFr: fAdvice.adviceFr,
        audioTextMg: `Vinavina toetrandro ${getDayNameMg(dObj)}: hafanana ${fTempMax} degre, orana ${fRainChance} isan-jato. ${fAdvice.adviceMg}`,
      });
    }

    const responsePayload = {
      id: region.id,
      nameMg: region.nameMg,
      nameFr: region.nameFr,
      description: region.description,
      granaryType: region.granaryType,
      today: todayWeather,
      forecast: forecastDays,
      isLive: true,
      lastUpdated: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    weatherCache.set(cacheKey, {
      data: responsePayload,
      timestamp: Date.now(),
    });

    res.json(responsePayload);
  } catch (error) {
    console.error('Error fetching weather:', error.message);

    // Provide safe fallback data so client never crashes
    const regionId = ((req.query.region) || 'ambatondrazaka').toLowerCase();
    const region = REGION_COORDS[regionId] || REGION_COORDS['ambatondrazaka'];
    const now = new Date();

    const fallbackPayload = {
      id: region.id,
      nameMg: region.nameMg,
      nameFr: region.nameFr,
      description: region.description,
      granaryType: region.granaryType,
      today: {
        date: now.toISOString().split('T')[0],
        dayNameMg: getDayNameMg(now),
        dayNameFr: getDayNameFr(now),
        condition: 'sunny',
        tempMax: 27,
        tempMin: 18,
        rainChance: 20,
        humidity: 62,
        windSpeed: 10,
        farmingAdviceMg: 'Toetrandro malefaka: mety tsara amin\'ny asa fambolena sy fanaraha-maso.',
        farmingAdviceFr: 'Temps doux et clément : propice aux travaux champêtres réguliers.',
        audioTextMg: `Toetrandro ao ${region.nameMg}. Hafanana 27 degre. Mety tsara amin'ny fambolena.`,
      },
      forecast: [
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          dayNameMg: getDayNameMg(new Date(Date.now() + 86400000)),
          dayNameFr: getDayNameFr(new Date(Date.now() + 86400000)),
          condition: 'partlyCloudy',
          tempMax: 26,
          tempMin: 17,
          rainChance: 30,
          humidity: 65,
          windSpeed: 12,
          farmingAdviceMg: 'Masoandro sy rahona: tsara hanohizana ny asa.',
          farmingAdviceFr: 'Éclaircies : idéal pour poursuivre les travaux de sarclage.',
          audioTextMg: 'Vinavina rahampitso: hafanana enina amby roapolo degre.',
        },
        {
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          dayNameMg: getDayNameMg(new Date(Date.now() + 86400000 * 2)),
          dayNameFr: getDayNameFr(new Date(Date.now() + 86400000 * 2)),
          condition: 'rainy',
          tempMax: 24,
          tempMin: 16,
          rainChance: 65,
          humidity: 75,
          windSpeed: 14,
          farmingAdviceMg: 'Mety hisy orana malefaka: manondraka ny tany.',
          farmingAdviceFr: 'Pluie probable : bénéfique pour l\'irrigation naturelle.',
          audioTextMg: 'Afak\'ampitso: mety hisy orana malefaka.',
        },
      ],
      isLive: false,
      lastUpdated: 'Toetrandro ifotony (Hors-ligne)',
    };

    res.json(fallbackPayload);
  }
});

// Production static file serving vs Development Vite middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? { server: httpServer } : false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  let currentPort = PORT;
  const maxAttempts = 5;

  function tryListen() {
    httpServer.listen(currentPort, '0.0.0.0', () => {
      console.log(`\n  🌱 Tantsaha Connect - Fampiharana ho an'ny Tantsaha`);
      console.log(`  --------------------------------------------------`);
      console.log(`  ➜ Local:   http://localhost:${currentPort}`);
      console.log(`  ➜ Network: http://127.0.0.1:${currentPort}\n`);
    });
  }

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && currentPort < PORT + maxAttempts) {
      console.warn(`⚠️  Le port ${currentPort} est déjà occupé. Tentative sur http://localhost:${currentPort + 1}...`);
      currentPort++;
      setTimeout(tryListen, 250);
    } else {
      console.error(`\n❌ Erreur de démarrage du serveur:`, err.message);
      if (err.code === 'EADDRINUSE') {
        console.error(`💡 Le port ${PORT} est déjà utilisé par une autre application.`);
        console.error(`👉 Solution : Libérez le port ou lancez avec : PORT=3005 npm run dev\n`);
      }
      process.exit(1);
    }
  });

  tryListen();
}

startServer();
