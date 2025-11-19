/* script.js
   Weather app using WeatherAPI (https://www.weatherapi.com/).

*/

/* --------- CONFIG --------- */
const API_KEY = "5c538c7c3f8e4873bee102616251911"; // <- Replace with your WeatherAPI key or hide server-side
const RECENT_KEY = 'weatherapi_recent_cities_v1';

/* --------- DOM --------- */
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locBtn = document.getElementById('locBtn');
const recentToggle = document.getElementById('recentToggle');
const recentDropdown = document.getElementById('recentDropdown');
const errorBox = document.getElementById('errorBox');
const errorMsg = document.getElementById('errorMsg');
const todayPlaceholder = document.getElementById('todayPlaceholder');
const todayCard = document.getElementById('today');
const todayCity = document.getElementById('todayCity');
const todayDesc = document.getElementById('todayDesc');
const weatherIcon = document.getElementById('weatherIcon');
const tempMain = document.getElementById('tempMain');
const unitToggle = document.getElementById('unitToggle');
const tempExtras = document.getElementById('tempExtras');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const pressureEl = document.getElementById('pressure');
const sunTimesEl = document.getElementById('sunTimes');
const forecastEl = document.getElementById('forecast');
const alertsEl = document.getElementById('alerts');
const refreshBtn = document.getElementById('refreshBtn');
const clearRecent = document.getElementById('clearRecent');
const rainLayer = document.getElementById('rainLayer');

let lastQuery = null;
let lastWeatherData = null;
let currentUnit = 'C'; // 'C' or 'F'

/* --------- UTILITIES --------- */
function showError(msg, hideAfter = 7000) {
  errorMsg.textContent = msg;
  errorBox.classList.remove('hidden');
  if (hideAfter) setTimeout(()=> errorBox.classList.add('hidden'), hideAfter);
}

function setRecent(city) {
  if (!city) return;
  const arr = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  const idx = arr.indexOf(city);
  if (idx >= 0) arr.splice(idx, 1);
  arr.unshift(city);
  if (arr.length > 8) arr.length = 8;
  localStorage.setItem(RECENT_KEY, JSON.stringify(arr));
  renderRecent();
}

function getRecent() {
  return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
}

function renderRecent() {
  const arr = getRecent();
  if (arr.length === 0) {
    recentDropdown.innerHTML = '<div class="p-2 text-slate-500">No recent searches</div>';
    return;
  }
  recentDropdown.innerHTML = arr.map((c, i) => `<div class="recent-item" data-index="${i}" role="menuitem">${c}</div>`).join('');
  Array.from(recentDropdown.children).forEach(el => {
    el.addEventListener('click', () => {
      const city = el.textContent.trim();
      cityInput.value = city;
      doSearchCity(city);
      recentDropdown.classList.add('hidden');
      recentToggle.setAttribute('aria-expanded','false');
    });
  });
}

/* ---- Rain animation toggle ---- */
function enableRain(enable) {
  if (enable) {
    document.body.classList.add('rainy');
    if (!rainLayer.dataset.created) {
      rainLayer.innerHTML = '';
      for (let i = 0; i < 60; i++) {
        const d = document.createElement('div');
        d.className = 'drop';
        d.style.left = (Math.random() * 100) + '%';
        d.style.animationDuration = (0.7 + Math.random() * 1.6) + 's';
        d.style.animationDelay = (Math.random() * -2) + 's';
        d.style.opacity = 0.25 + Math.random() * 0.7;
        rainLayer.appendChild(d);
      }
      rainLayer.dataset.created = '1';
    }
  } else {
    document.body.classList.remove('rainy');
  }
}

/* ---- format temp ---- */
function formatTemp(celsius, unit) {
  if (unit === 'C') return `${Math.round(celsius)}°C`;
  return `${Math.round((celsius * 9/5) + 32)}°F`;
}

/* ---- build WeatherAPI URL ---- */
function weatherApiUrlForQuery(q) {
  // q: "city name" or "lat,lon"
  return `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(API_KEY)}&q=${encodeURIComponent(q)}&days=5&aqi=yes&alerts=yes`;
}

/* ---- fetch ---- */
async function fetchWeather(q) {
  if (!API_KEY || API_KEY.trim().length === 0) throw new Error('API key missing. Add your WeatherAPI key to the script.');
  const url = weatherApiUrlForQuery(q);
  console.log('Requesting (redacted):', url.replace(/key=[^&]+/, 'key=***'));
  const res = await fetch(url);
  if (!res.ok) {
    const errBody = await res.json().catch(()=>null);
    const msg = errBody && errBody.error && errBody.error.message ? errBody.error.message : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

/* ---- render ---- */
function getIconHtml(iconUrl, text) {
  const src = iconUrl.startsWith('//') ? 'https:' + iconUrl : iconUrl;
  return `<div class="w-24 h-24 flex items-center justify-center"><img alt="${text}" src="${src}" class="w-20 h-20" /></div>`;
}

function processAndRender(data) {
  lastWeatherData = data;
  todayPlaceholder.classList.add('hidden');
  todayCard.classList.remove('hidden');

  const loc = data.location;
  const cur = data.current;
  todayCity.textContent = `${loc.name}, ${loc.region ? loc.region + ', ' : ''}${loc.country}`;
  todayDesc.textContent = cur.condition.text;

  weatherIcon.innerHTML = getIconHtml(cur.condition.icon, cur.condition.text);
  tempMain.textContent = formatTemp(cur.temp_c, currentUnit);
  tempExtras.textContent = `Feels like ${formatTemp(cur.feelslike_c, currentUnit)} • ${cur.condition.text}`;

  humidityEl.textContent = `Humidity: ${cur.humidity}%`;
  windEl.textContent = `Wind: ${cur.wind_kph} kph`;
  pressureEl.textContent = `Pressure: ${cur.pressure_mb} hPa`;

  // Attempt to get sunrise/sunset from forecast first day astro if available
  const firstDay = data.forecast && data.forecast.forecastday && data.forecast.forecastday[0];
  if (firstDay && firstDay.astro) {
    sunTimesEl.textContent = `Sunrise: ${firstDay.astro.sunrise} · Sunset: ${firstDay.astro.sunset}`;
  } else {
    sunTimesEl.textContent = `Local time: ${loc.localtime || '-'}`;
  }

  // rain detection
  const condLower = (cur.condition.text || '').toLowerCase();
  const isRain = condLower.includes('rain') || condLower.includes('drizzle') || condLower.includes('thunder') || cur.precip_mm > 0;
  enableRain(isRain);

  // Alerts
  if (data.alerts && data.alerts.alert && data.alerts.alert.length) {
    alertsEl.innerHTML = data.alerts.alert.map(a => `<div class="text-sm text-red-600 font-semibold">${a.headline}</div>`).join('');
  } else {
    alertsEl.textContent = 'No alerts.';
  }

  setRecent(loc.name);

  // Forecast
  forecastEl.innerHTML = '';
  const days = data.forecast?.forecastday || [];
  for (const d of days) {
    const dateStr = new Date(d.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const icon = d.day.condition.icon;
    const desc = d.day.condition.text;
    const avgC = d.day.avgtemp_c ?? ((d.day.maxtemp_c + d.day.mintemp_c) / 2);
    const card = document.createElement('div');
    card.className = 'min-w-[140px] p-3 rounded-lg glass';
    card.innerHTML = `
      <div class="text-sm font-semibold">${dateStr}</div>
      <div class="flex items-center gap-2 mt-2">
        <div class="w-12 h-12"><img src="${icon.startsWith('//') ? 'https:' + icon : icon}" alt="${desc}" class="w-10 h-10" /></div>
        <div>
          <div class="text-lg font-bold">${currentUnit === 'C' ? Math.round(avgC) + '°C' : Math.round((avgC * 9/5) + 32) + '°F'}</div>
          <div class="text-xs text-slate-400">${desc}</div>
        </div>
      </div>
      <div class="mt-2 text-xs text-slate-500">Max: ${Math.round(d.day.maxtemp_c)}°C • Min: ${Math.round(d.day.mintemp_c)}°C</div>
    `;
    forecastEl.appendChild(card);
  }

  lastQuery = loc.name;
}

/* ---- search flow ---- */
async function doSearchCity(city) {
  city = (city || '').trim();
  if (!city) { showError('Please enter a city name.'); return; }
  try {
    const data = await fetchWeather(city);
    processAndRender(data);
  } catch (e) {
    console.error('WeatherAPI error:', e);
    showError(e.message || 'Failed to fetch weather');
  }
}

/* ---- events ---- */
searchBtn.addEventListener('click', () => doSearchCity(cityInput.value));
cityInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearchCity(cityInput.value); });

recentToggle.addEventListener('click', () => {
  const isHidden = recentDropdown.classList.contains('hidden');
  recentDropdown.classList.toggle('hidden');
  recentToggle.setAttribute('aria-expanded', String(isHidden));
  renderRecent();
});

clearRecent.addEventListener('click', () => {
  localStorage.removeItem(RECENT_KEY);
  renderRecent();
});

refreshBtn.addEventListener('click', () => {
  if (!lastQuery && !lastWeatherData) { showError('No last search to refresh.'); return; }
  if (lastWeatherData) doSearchCity(lastWeatherData.location.name);
  else if (lastQuery) doSearchCity(lastQuery);
});

locBtn.addEventListener('click', () => {
  if (!navigator.geolocation) { showError('Geolocation not supported in this browser.'); return; }
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const latlon = `${pos.coords.latitude},${pos.coords.longitude}`;
      const data = await fetchWeather(latlon);
      processAndRender(data);
    } catch (e) {
      console.error(e);
      showError(e.message || 'Failed to get weather for your location');
    }
  }, (err) => {
    showError('Geolocation permission denied or unavailable.');
  }, { timeout: 10000 });
});

unitToggle.addEventListener('click', () => {
  currentUnit = currentUnit === 'C' ? 'F' : 'C';
  unitToggle.textContent = currentUnit === 'C' ? '°C' : '°F';
  if (lastWeatherData) {
    // re-render using lastWeatherData (it has Celsius values)
    processAndRender(lastWeatherData);
  }
});

/* ---- init ---- */
renderRecent();
// Optionally: auto-load last recent search
const recents = getRecent();
if (recents && recents.length) {
  // load the most recent silently (comment this out if not desired)
  // doSearchCity(recents[0]);
}
