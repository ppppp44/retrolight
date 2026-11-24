'use strict';

const STORAGE_KEYS = {
  theme: 'retrolight.theme',
  presets: 'retrolight.presets',
  broker: 'retrolight.broker'
};

const DEFAULT_BROKER_URL = 'wss://q3762a14.ala.us-east-1.emqxsl.com:8084/mqtt';
const DEFAULT_TOPIC_ROOT = 'retrolight/room';

const EFFECTS = [
  { id: 'rainbow', name: 'Rainbow Flow', short: 'Rainbow', category: 'dynamic', group: 'Popular', description: 'A smooth spectrum that keeps the energy moving.', a: '#ff5c8a', b: '#5d80ff', icon: 'i-waves' },
  { id: 'aurora', name: 'Aurora', category: 'ambient', group: 'Atmosphere', description: 'Soft teal and violet waves drift across the room.', a: '#45e3c0', b: '#6678ed', icon: 'i-waves' },
  { id: 'sunset', name: 'Sunset', category: 'ambient', group: 'Atmosphere', description: 'Warm amber, coral, and dusk-purple tones.', a: '#ff995c', b: '#b65edb', icon: 'i-sun' },
  { id: 'fire', name: 'Fire Glow', category: 'dynamic', group: 'Atmosphere', description: 'A cozy, gently flickering ember effect.', a: '#ff502d', b: '#ffbb54', icon: 'i-zap' },
  { id: 'ocean', name: 'Ocean', category: 'ambient', group: 'Atmosphere', description: 'Deep blues and cool aqua tones in motion.', a: '#2877f4', b: '#54d9e3', icon: 'i-waves' },
  { id: 'breathing', name: 'Breathing', category: 'ambient', group: 'Calm', description: 'A slow, smooth rise and fall in brightness.', a: '#7e8eff', b: '#b18cff', icon: 'i-sun' },
  { id: 'fade', name: 'Color Fade', category: 'color', group: 'Color', description: 'Blends gradually from one color into the next.', a: '#ea6cb9', b: '#6c85f2', icon: 'i-palette' },
  { id: 'solid', name: 'Solid Color', category: 'color', group: 'Color', description: 'Hold one carefully chosen color.', a: '#6f80ed', b: '#6acde0', icon: 'i-palette' },
  { id: 'pulse', name: 'Pulse', category: 'dynamic', group: 'Motion', description: 'A more defined rhythmic brightness pulse.', a: '#4c94ff', b: '#b36cff', icon: 'i-zap' },
  { id: 'strobe', name: 'Strobe', category: 'dynamic', group: 'Motion', description: 'A simple on-off flash pattern with a capped rate.', a: '#f4f5ff', b: '#7480ff', icon: 'i-zap' },
  { id: 'dual', name: 'Dual Color', category: 'color', group: 'Color', description: 'Move between two colors of your choice.', a: '#ff6ba7', b: '#56c7f0', icon: 'i-palette' },
  { id: 'random', name: 'Random', category: 'dynamic', group: 'Motion', description: 'Explore a new color at a relaxed interval.', a: '#fd8a71', b: '#79d8bd', icon: 'i-refresh' },
  { id: 'night', name: 'Night Light', category: 'ambient', group: 'Calm', description: 'A low, warm glow for a softer space.', a: '#f4a65f', b: '#e4c27c', icon: 'i-moon' },
  { id: 'ice', name: 'Ice', category: 'color', group: 'Color', description: 'Cool whites and icy blue tones.', a: '#d5f5ff', b: '#57b6ef', icon: 'i-waves' },
  { id: 'lava', name: 'Lava', category: 'dynamic', group: 'Motion', description: 'Molten reds and oranges with a slow drift.', a: '#ff4b36', b: '#ffb347', icon: 'i-zap' },
  { id: 'rain', name: 'Rain', category: 'ambient', group: 'Atmosphere', description: 'A cool blue shimmer with gentle variation.', a: '#4e9cdb', b: '#8bc9e8', icon: 'i-waves' },
  { id: 'sparkle', name: 'Sparkle', category: 'dynamic', group: 'Motion', description: 'Small, scattered flashes of brighter color.', a: '#9b8cff', b: '#58d6e7', icon: 'i-zap' },
  { id: 'pride', name: 'Spectrum Bands', category: 'color', group: 'Color', description: 'A colorful multi-band spectrum.', a: '#ef6aa9', b: '#66c9e8', icon: 'i-palette' },
  { id: 'moonlight', name: 'Moonlight', category: 'ambient', group: 'Calm', description: 'A quiet blue-white ambient scene.', a: '#8ca9ec', b: '#d4e3ff', icon: 'i-moon' },
  { id: 'music', name: 'Music Reactive', category: 'reactive', group: 'Reactive', description: 'Let live sound shape brightness and color.', a: '#8b76ff', b: '#4cc9d9', icon: 'i-music' }
];

const DEFAULT_PALETTE = ['#8B72FF', '#4C9EFF', '#45D5C1', '#F29A68', '#E96FA9', '#F2D16D', '#D8E5FF', '#72BCEB'];
const state = {
  page: 'overview', theme: 'dark', power: true, brightness: 75, speed: 55,
  hue: 258, saturation: 78, intensity: 100, color: '#8B72FF', effect: 'rainbow',
  effectFilter: 'all', effectSearch: '', musicMode: 'spectrum', sensitivity: 65,
  presets: [], mqttClient: null, mqttConnected: false, deviceOnline: false,
  brokerTopic: DEFAULT_TOPIC_ROOT,
  audioStream: null, audioContext: null, analyser: null, audioFrame: null,
  lastMusicPublish: 0, lastStatusMessage: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name, extra = '') => `<svg class="icon ${extra}" aria-hidden="true"><use href="#${name}"/></svg>`;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function toast(message, type = 'success') {
  const item = document.createElement('div');
  item.className = `toast ${type === 'error' ? 'error' : ''}`;
  item.innerHTML = `${icon(type === 'error' ? 'i-x' : 'i-check')}<span></span>`;
  $('.toast-region').append(item);
  $('span', item).textContent = message;
  window.setTimeout(() => item.remove(), 3100);
}

function loadStoredState() {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.theme);
    if (theme === 'light' || theme === 'dark') state.theme = theme;
    const presets = JSON.parse(localStorage.getItem(STORAGE_KEYS.presets) || '[]');
    if (Array.isArray(presets)) state.presets = presets.slice(0, 60);
    const broker = JSON.parse(localStorage.getItem(STORAGE_KEYS.broker) || '{}');
    if (broker && typeof broker === 'object') {
      $('#brokerUrl').value = broker.url || DEFAULT_BROKER_URL;
      $('#mqttUsername').value = broker.username || '';
      $('#mqttPassword').value = '';
      $('#mqttTopic').value = broker.topic || DEFAULT_TOPIC_ROOT;
      state.brokerTopic = broker.topic || DEFAULT_TOPIC_ROOT;
    }
  } catch (error) {
    console.warn('RETROLIGHT: saved preferences could not be loaded.', error);
  }
  applyTheme(state.theme, false);
}

function applyTheme(theme, announce = true) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  document.body.dataset.theme = state.theme;
  const iconName = state.theme === 'dark' ? 'i-sun' : 'i-moon';
  $('#themeIcon').innerHTML = `<use href="#${iconName}"/>`;
  $$('.theme-option').forEach(button => button.classList.toggle('active', button.dataset.themeChoice === state.theme));
  try { localStorage.setItem(STORAGE_KEYS.theme, state.theme); } catch (_) { /* storage may be unavailable */ }
  if (announce) toast(`${state.theme === 'dark' ? 'Dark' : 'Light'} glass theme enabled.`);
}

function navigate(page) {
  const target = $(`#page-${page}`);
  if (!target) return;
  state.page = page;
  $$('.page').forEach(section => section.classList.toggle('active', section === target));
  $$('[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === page));
  $('#breadcrumbCurrent').textContent = target.dataset.title || page;
  $('#sidebar').classList.remove('mobile-open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'colors') requestAnimationFrame(updateWheelThumb);
}

function hsvToRgb(h, s, v) {
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}
function rgbToHex({ r, g, b }) { return `#${[r, g, b].map(n => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase()}`; }
function hexToRgb(hex) {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return { r: parseInt(clean.slice(0, 2), 16), g: parseInt(clean.slice(2, 4), 16), b: parseInt(clean.slice(4, 6), 16) };
}
function rgbToHsv({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  let h = 0;
  if (delta) {
    if (max === r) h = 60 * (((g - b) / delta) % 6);
    else if (max === g) h = 60 * ((b - r) / delta + 2);
    else h = 60 * ((r - g) / delta + 4);
  }
  if (h < 0) h += 360;
  return { h, s: max === 0 ? 0 : (delta / max) * 100, v: max * 100 };
}

function updateWheelThumb() {
  const wheel = $('#hueWheel');
  const rect = wheel.getBoundingClientRect();
  const radius = rect.width / 2 - 9;
  const angle = (state.hue - 90) * Math.PI / 180;
  $('#wheelThumb').style.left = `${rect.width / 2 + Math.cos(angle) * radius}px`;
  $('#wheelThumb').style.top = `${rect.height / 2 + Math.sin(angle) * radius}px`;
  $('#wheelThumb').style.transform = 'translate(-50%, -50%)';
  $('#wheelThumb').style.background = state.color;
  wheel.setAttribute('aria-valuenow', String(Math.round(state.hue)));
}

function renderColor(send = false) {
  const rgb = hsvToRgb(state.hue, state.saturation, state.intensity);
  state.color = rgbToHex(rgb);
  const hslHue = state.hue;
  $('#wheelSwatch').style.background = state.color;
  $('#wheelHex').textContent = state.color;
  $('#wheelThumb').style.background = state.color;
  $('#previewHex').textContent = state.color;
  $('#previewRgb').textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  $('#largeColorSwatch').style.background = state.color;
  $('#hexInput').value = state.color.slice(1);
  $('#saturationValue').textContent = `${Math.round(state.saturation)}%`;
  $('#colorLightnessValue').textContent = `${Math.round(state.intensity)}%`;
  $('#saturationSlider').value = String(Math.round(state.saturation));
  $('#colorLightnessSlider').value = String(Math.round(state.intensity));
  document.documentElement.style.setProperty('--current-hue', `${hslHue}`);
  document.documentElement.style.setProperty('--current-color', state.color);
  document.documentElement.style.setProperty('--orb-color', state.color);
  $('#heroOrb').style.setProperty('--orb-color', state.color);
  $('#heroHex').textContent = state.color;
  $('#heroColorLabel').textContent = 'COLOR PREVIEW';
  updateWheelThumb();
  renderPaletteActive();
  if (send) sendCommand('color', { hex: state.color, ...rgb });
}

function setColorFromHex(hex, send = false) {
  const rgb = hexToRgb(hex);
  if (!rgb) { toast('Enter a valid 6-digit hex color.', 'error'); return false; }
  const hsv = rgbToHsv(rgb);
  state.hue = hsv.h;
  state.saturation = hsv.s;
  state.intensity = hsv.v;
  renderColor(send);
  return true;
}

function hueFromPointer(event) {
  const rect = $('#hueWheel').getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  let degrees = Math.atan2(dy, dx) * 180 / Math.PI + 90;
  if (degrees < 0) degrees += 360;
  state.hue = degrees % 360;
  renderColor(false);
  if (state.effect === 'solid') sendCommand('color', { hex: state.color, ...hsvToRgb(state.hue, state.saturation, state.intensity) });
}

function setBrightness(value, send = true) {
  state.brightness = clamp(Number(value) || 0, 0, 100);
  $('#brightnessSlider').value = String(state.brightness);
  $('#brightnessValue').innerHTML = `${Math.round(state.brightness)}<span>%</span>`;
  $('#heroBrightness').textContent = `${Math.round(state.brightness)}%`;
  if (send) sendCommand('brightness', { value: Math.round(state.brightness) });
}

function setSpeed(value, send = true) {
  state.speed = clamp(Number(value) || 0, 0, 100);
  $('#speedSlider').value = String(state.speed);
  $('#speedValue').textContent = `${Math.round(state.speed)}%`;
  if (send) sendCommand('speed', { value: Math.round(state.speed) });
}

function setPower(on, send = true) {
  state.power = Boolean(on);
  $('#powerSwitch').classList.toggle('is-on', state.power);
  $('#powerSwitch').setAttribute('aria-checked', String(state.power));
  $('#heroPower').innerHTML = `${icon('i-power', 'icon-small')}<span>${state.power ? 'Turn lights off' : 'Turn lights on'}</span>`;
  $('#heroSceneState').textContent = state.power ? (state.mqttConnected ? 'CONNECTED' : 'PREVIEW') : 'POWER OFF';
  $('#heroOrb').style.opacity = state.power ? '1' : '.23';
  if (send) sendCommand('power', { on: state.power });
}

function setEffect(id, send = true) {
  const effect = EFFECTS.find(item => item.id === id);
  if (!effect) return;
  state.effect = id;
  $('#heroEffect').innerHTML = effect.name === 'Rainbow Flow' ? 'Rainbow<br>flow' : effect.name.replace(' ', '<br>');
  $('#heroEffectDescription').textContent = effect.description;
  $('#heroMode').textContent = effect.name;
  $('#heroColorLabel').textContent = effect.name.toUpperCase();
  $$('.effect-card').forEach(card => {
    const selected = card.dataset.effect === id;
    card.classList.toggle('selected', selected);
    const badge = $('.effect-selected-label', card);
    if (badge) badge.remove();
    if (selected) {
      const art = $('.effect-art', card);
      const label = document.createElement('span'); label.className = 'effect-selected-label'; label.textContent = 'ACTIVE'; art.append(label);
    }
  });
  if (send) sendCommand('effect', { id });
}

function effectCard(effect, compact = false) {
  const selected = state.effect === effect.id;
  const card = document.createElement('button');
  card.className = `effect-card${selected ? ' selected' : ''}`;
  card.type = 'button';
  card.dataset.effect = effect.id;
  card.innerHTML = `<div class="effect-art" style="--effect-a:${effect.a};--effect-b:${effect.b}">${selected ? '<span class="effect-selected-label">ACTIVE</span>' : ''}<span class="art-orbit"></span>${icon(effect.icon)}</div><div class="effect-card-info"><div><strong></strong><small></small></div>${icon(selected ? 'i-check' : 'i-arrow-up-right')}</div>`;
  $('strong', card).textContent = effect.name;
  $('small', card).textContent = compact ? effect.group : effect.description;
  card.addEventListener('click', () => { setEffect(effect.id); toast(`${effect.name} selected.`); });
  return card;
}

function renderPopularEffects() {
  const container = $('#popularEffects'); container.replaceChildren();
  ['rainbow', 'aurora', 'sunset', 'fire'].forEach(id => {
    const effect = EFFECTS.find(item => item.id === id);
    container.append(effectCard(effect, true));
  });
}

function renderEffects() {
  const term = state.effectSearch.toLowerCase();
  const results = EFFECTS.filter(effect => {
    const filterMatch = state.effectFilter === 'all' || effect.category === state.effectFilter;
    const textMatch = `${effect.name} ${effect.description} ${effect.group}`.toLowerCase().includes(term);
    return filterMatch && textMatch;
  });
  const container = $('#allEffects'); container.replaceChildren();
  results.forEach(effect => container.append(effectCard(effect)));
  $('#noEffects').classList.toggle('hidden', results.length > 0);
}

function renderPaletteActive() {
  $$('.palette-swatch').forEach(button => button.classList.toggle('active', button.dataset.color.toUpperCase() === state.color.toUpperCase()));
}
function renderPalette(colors = DEFAULT_PALETTE) {
  const container = $('#paletteSwatches'); container.replaceChildren();
  colors.forEach(color => {
    const button = document.createElement('button'); button.className = 'palette-swatch'; button.type = 'button'; button.style.background = color; button.dataset.color = color; button.setAttribute('aria-label', `Select ${color}`);
    button.addEventListener('click', () => { setColorFromHex(color, true); toast(`${color} selected.`); });
    container.append(button);
  });
  renderPaletteActive();
}

function savePreset(name, preset = {}) {
  const presetName = (name || '').trim().slice(0, 28);
  if (!presetName) return false;
  const data = { id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, name: presetName, color: preset.color || state.color, effect: preset.effect || state.effect, brightness: preset.brightness ?? state.brightness, createdAt: Date.now() };
  state.presets.unshift(data); state.presets = state.presets.slice(0, 60);
  persistPresets(); renderPresets(); toast(`Preset “${presetName}” saved.`);
  return true;
}
function persistPresets() { try { localStorage.setItem(STORAGE_KEYS.presets, JSON.stringify(state.presets)); } catch (_) { toast('Could not save presets in this browser.', 'error'); } }
function renderPresets() {
  const grid = $('#presetGrid'); grid.replaceChildren();
  $('#emptyPresets').classList.toggle('hidden', state.presets.length > 0);
  state.presets.forEach(preset => {
    const card = document.createElement('article'); card.className = 'preset-card glass-panel';
    const colors = [preset.color || '#8B72FF', preset.effect === 'rainbow' ? '#4ac6e8' : preset.color || '#8B72FF'];
    card.innerHTML = `<div class="preset-color-band" style="--preset-a:${colors[0]};--preset-b:${colors[1]}"><span>LIGHTING SCENE</span></div><div class="preset-info"><div><strong></strong><small></small></div><div class="preset-actions"><button type="button" class="preset-apply" aria-label="Apply preset">${icon('i-play')}</button><button type="button" class="preset-delete" aria-label="Delete preset">${icon('i-trash')}</button></div></div>`;
    $('strong', card).textContent = preset.name;
    $('small', card).textContent = `${preset.effect} · ${Math.round(preset.brightness)}% brightness`;
    $('.preset-apply', card).addEventListener('click', () => applyPreset(preset));
    $('.preset-delete', card).addEventListener('click', () => { state.presets = state.presets.filter(item => item.id !== preset.id); persistPresets(); renderPresets(); toast('Preset deleted.'); });
    grid.append(card);
  });
}
function applyPreset(preset) {
  setColorFromHex(preset.color || '#8B72FF', true);
  setBrightness(preset.brightness ?? 75);
  setEffect(preset.effect || 'solid');
  setPower(true);
  toast(`Loaded “${preset.name}”.`);
}
function promptSavePreset() {
  const defaultName = `${EFFECTS.find(effect => effect.id === state.effect)?.name || 'Lighting'} setup`;
  const name = window.prompt('Name this preset:', defaultName);
  if (name === null) return;
  if (!savePreset(name)) toast('Give your preset a name first.', 'error');
}

function saveBrokerPreferences(url, username, topic) {
  try { localStorage.setItem(STORAGE_KEYS.broker, JSON.stringify({ url, username, topic })); } catch (_) { /* optional preference */ }
}
function setConnectionUi(connected, detail = '') {
  state.mqttConnected = connected;
  if (!connected) state.deviceOnline = false;

  const controllerOnline = connected && state.deviceOnline;
  const statusLabel = !connected ? 'Preview mode' : (controllerOnline ? 'Controller connected' : 'Broker connected');
  const sidebarLabel = !connected ? 'OFFLINE' : (controllerOnline ? 'ONLINE' : 'BROKER');

  $('#connectionPill').classList.toggle('connected', connected);
  $('#connectionText').textContent = statusLabel;
  $('#sidebarStatus').textContent = sidebarLabel;
  $('#sidebarStatus').style.color = connected ? 'var(--success)' : '';
  $('#sidebarNetwork').textContent = controllerOnline ? 'Controller online' : (connected ? 'Broker connected' : 'Not connected');
  $('#connectionPill .status-pulse').classList.toggle('connected', connected);
  $('#settingsConnectionState').textContent = statusLabel;
  $('#settingsConnectionDetail').textContent = connected
    ? (detail || (controllerOnline ? 'The ESP32 is online and reporting state.' : 'Secure broker connected. Waiting for the TTGO controller.'))
    : 'Preview mode. Controls update locally on this device.';
  $('#settingsStateTag').textContent = !connected ? 'PREVIEW' : (controllerOnline ? 'ONLINE' : 'BROKER');
  $('#connectionStateBox').classList.toggle('connected', connected);
  $('#connectButton').disabled = connected;
  $('#disconnectButton').disabled = !connected;
  $('#heroSceneState').textContent = !connected
    ? (state.power ? 'PREVIEW' : 'POWER OFF')
    : (controllerOnline ? (state.power ? 'CONNECTED' : 'POWER OFF') : 'WAITING');
  if (controllerOnline) {
    $('#connectionHelp').textContent = 'Controller online. Commands publish to the command topic and status updates arrive on the state topic.';
  } else if (connected) {
    $('#connectionHelp').textContent = 'Broker connected. Waiting for the ESP32 to publish its online status.';
  } else if (detail) {
    $('#connectionHelp').textContent = detail;
  }
}

function loadMqttLibrary() {
  if (window.mqtt) return Promise.resolve(window.mqtt);
  if (window._retrolightMqttPromise) return window._retrolightMqttPromise;
  window._retrolightMqttPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/mqtt/dist/mqtt.min.js';
    script.async = true;
    script.onload = () => window.mqtt ? resolve(window.mqtt) : reject(new Error('MQTT library did not initialize.'));
    script.onerror = () => reject(new Error('Could not load the MQTT client library. Check your internet connection.'));
    document.head.append(script);
  });
  return window._retrolightMqttPromise;
}

async function connectMqtt(event) {
  event?.preventDefault();
  const url = $('#brokerUrl').value.trim();
  const username = $('#mqttUsername').value.trim();
  const password = $('#mqttPassword').value;
  const topic = $('#mqttTopic').value.trim().replace(/\/+$/, '');

  if (!/^wss:\/\//i.test(url)) {
    toast('Use a secure broker URL beginning with wss://.', 'error');
    return;
  }
  if (!username || !password) {
    toast('Enter the EMQX username and password you created.', 'error');
    return;
  }
  if (!topic || /[+#\s]/.test(topic)) {
    toast('Enter a valid topic root without spaces, +, or #.', 'error');
    return;
  }

  const button = $('#connectButton');
  button.disabled = true;
  button.textContent = 'Connecting…';
  saveBrokerPreferences(url, username, topic);

  try {
    const mqtt = await loadMqttLibrary();
    if (state.mqttClient) {
      try { state.mqttClient.end(true); } catch (_) { /* ignore old client */ }
    }

    const client = mqtt.connect(url, {
      username,
      password,
      clean: true,
      connectTimeout: 12000,
      reconnectPeriod: 3000,
      keepalive: 30,
      clientId: `retrolight-web-${Math.random().toString(16).slice(2, 10)}`
    });

    state.mqttClient = client;
    state.brokerTopic = topic;
    state.deviceOnline = false;

    client.on('connect', () => {
      client.subscribe(`${topic}/state`, { qos: 0 }, error => {
        if (error) {
          setConnectionUi(false, `Connected, but state subscription failed: ${error.message}`);
          toast(`State subscription failed: ${error.message}`, 'error');
          button.disabled = false;
          button.innerHTML = `${icon('i-wifi', 'icon-small')} Connect`;
          return;
        }
        setConnectionUi(true, 'Secure broker connected. Waiting for the TTGO controller.');
        toast('Connected securely to the EMQX broker.');
        button.innerHTML = `${icon('i-check', 'icon-small')} Connected`;
      });
    });

    client.on('reconnect', () => {
      state.deviceOnline = false;
      setConnectionUi(false, 'Broker connection lost. Retrying automatically…');
      button.disabled = false;
      button.innerHTML = `${icon('i-wifi', 'icon-small')} Reconnect`;
    });

    client.on('offline', () => {
      state.deviceOnline = false;
      setConnectionUi(false, 'Broker is offline. Check your network and retry.');
      button.disabled = false;
      button.innerHTML = `${icon('i-wifi', 'icon-small')} Reconnect`;
    });

    client.on('close', () => {
      if (state.mqttClient === client) {
        setConnectionUi(false, 'Connection closed. Check the broker and network.');
        button.disabled = false;
        button.innerHTML = `${icon('i-wifi', 'icon-small')} Connect`;
      }
    });

    client.on('error', error => {
      console.warn('MQTT connection error:', error);
      setConnectionUi(false, error.message || 'Broker connection failed. Check the username, password, and WSS address.');
      button.disabled = false;
      button.innerHTML = `${icon('i-wifi', 'icon-small')} Connect`;
    });

    client.on('message', (topicName, message) => handleDeviceMessage(topicName, message.toString()));
  } catch (error) {
    console.error(error);
    setConnectionUi(false, error.message);
    toast(error.message || 'Could not connect.', 'error');
    button.disabled = false;
    button.innerHTML = `${icon('i-wifi', 'icon-small')} Connect`;
  }
}

function disconnectMqtt() {
  if (state.mqttClient) { try { state.mqttClient.end(true); } catch (_) { /* ignore */ } }
  state.mqttClient = null; setConnectionUi(false); $('#connectButton').disabled = false; $('#connectButton').innerHTML = `${icon('i-wifi', 'icon-small')} Connect`;
  toast('Dashboard disconnected from the broker.');
}

function sendCommand(type, payload = {}) {
  if (!state.mqttConnected || !state.mqttClient) return false;
  const topic = `${state.brokerTopic}/command`;
  const message = JSON.stringify({ type, ...payload, source: 'retrolight-web', ts: Date.now() });
  state.mqttClient.publish(topic, message, { qos: 0, retain: false }, error => {
    if (error) toast(`Command failed: ${error.message}`, 'error');
  });
  return true;
}

function handleDeviceMessage(topicName, raw) {
  try {
    const message = JSON.parse(raw);
    state.lastStatusMessage = message;

    if (message.online === false) {
      state.deviceOnline = false;
      setConnectionUi(state.mqttConnected, 'Broker connected, but the TTGO controller is offline.');
      return;
    }

    if (message.online === true) {
      state.deviceOnline = true;
      setConnectionUi(state.mqttConnected, message.ip ? `TTGO online at ${message.ip}.` : 'TTGO controller is online.');
    }

    if (message.power !== undefined) setPower(Boolean(message.power), false);
    if (message.brightness !== undefined) setBrightness(message.brightness, false);
    if (message.effect && EFFECTS.some(effect => effect.id === message.effect)) setEffect(message.effect, false);
    if (message.color && /^#[0-9a-f]{6}$/i.test(message.color)) setColorFromHex(message.color, false);
    if (message.ip) $('#sidebarNetwork').textContent = `IP ${message.ip}`;
    if (state.deviceOnline) {
      $('#settingsConnectionDetail').textContent = message.ip
        ? `Controller IP ${message.ip}. Receiving live state updates.`
        : 'Receiving controller state updates.';
    }
  } catch (error) {
    console.warn('Ignored unrecognized device state:', topicName, error);
  }
}

function createVisualizerBars() {
  const container = $('#visualizerBars');
  for (let index = 0; index <  fortyBars(); index++) {
    const bar = document.createElement('span'); bar.className = 'visualizer-bar'; bar.style.height = `${5 + Math.random() * 9}%`; container.append(bar);
  }
}
function fortyBars() { return 40; }

async function startMicrophone() {
  if (!navigator.mediaDevices?.getUserMedia) {
    toast('Microphone access needs a supported browser and a secure page (HTTPS).', 'error'); return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Web Audio is not available in this browser.');
    const context = new AudioContextClass();
    await context.resume();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser(); analyser.fftSize = 2048; analyser.smoothingTimeConstant = 0.72;
    source.connect(analyser);
    state.audioStream = stream; state.audioContext = context; state.analyser = analyser;
    $('#micButton').innerHTML = `${icon('i-pause', 'icon-small')}<span>Stop microphone</span>`;
    $('#micStatus').classList.add('active'); $('#micStatus').innerHTML = '<span class="status-pulse"></span> MICROPHONE ACTIVE';
    $('#inputLevel').innerHTML = '0<span>%</span>';
    toast('Microphone enabled. Audio is analyzed on this device.');
    analyzeAudio();
  } catch (error) {
    console.error('Microphone could not start:', error);
    toast(error.name === 'NotAllowedError' ? 'Microphone permission was denied. Allow it in your browser settings.' : (error.message || 'Could not start the microphone.'), 'error');
  }
}

function analyzeAudio() {
  if (!state.analyser) return;
  const analyser = state.analyser;
  const data = new Uint8Array(analyser.frequencyBinCount);
  const sampleRate = state.audioContext.sampleRate;
  const nyquist = sampleRate / 2;
  const toBin = hz => Math.max(1, Math.floor((hz / nyquist) * data.length));
  const averageRange = (startHz, endHz) => {
    const start = clamp(toBin(startHz), 0, data.length - 1);
    const end = clamp(toBin(endHz), start + 1, data.length);
    let sum = 0;
    for (let i = start; i < end; i++) sum += data[i];
    return sum / Math.max(1, end - start) / 255;
  };
  const bars = $$('.visualizer-bar');
  const loop = () => {
    if (!state.analyser) return;
    analyser.getByteFrequencyData(data);
    const sensitivity = state.sensitivity / 65;
    const bass = clamp(averageRange(45, 250) * sensitivity * 100, 0, 100);
    const mid = clamp(averageRange(250, 2000) * sensitivity * 100, 0, 100);
    const treble = clamp(averageRange(2000, 9000) * sensitivity * 100, 0, 100);
    const level = clamp((bass * .38 + mid * .38 + treble * .24), 0, 100);
    $('#inputLevel').innerHTML = `${Math.round(level)}<span>%</span>`;
    $('#bassLevel').textContent = `${Math.round(bass)}%`;
    $('#midLevel').textContent = `${Math.round(mid)}%`;
    $('#trebleLevel').textContent = `${Math.round(treble)}%`;
    const stride = Math.max(1, Math.floor(data.length / bars.length));
    bars.forEach((bar, index) => {
      const raw = data[Math.min(data.length - 1, index * stride)] / 255;
      const shaped = Math.pow(raw, .8) * (state.sensitivity / 65);
      bar.style.height = `${Math.max(3, clamp(shaped * 91, 3, 95))}%`;
    });
    const now = performance.now();
    if (state.mqttConnected && now - state.lastMusicPublish > 100) {
      state.lastMusicPublish = now;
      let musicPayload = { mode: state.musicMode, bass: Math.round(bass), mid: Math.round(mid), treble: Math.round(treble), level: Math.round(level) };
      if (state.musicMode === 'wave') musicPayload = { ...musicPayload, brightness: Math.round(clamp(level, 8, 100)) };
      sendCommand('music', musicPayload);
    }
    state.audioFrame = requestAnimationFrame(loop);
  };
  state.audioFrame = requestAnimationFrame(loop);
}

function stopMicrophone() {
  if (state.audioFrame) cancelAnimationFrame(state.audioFrame);
  state.audioFrame = null; state.analyser = null;
  if (state.audioStream) state.audioStream.getTracks().forEach(track => track.stop());
  state.audioStream = null;
  if (state.audioContext) state.audioContext.close().catch(() => {});
  state.audioContext = null;
  $('#micButton').innerHTML = `${icon('i-mic', 'icon-small')}<span>Enable microphone</span>`;
  $('#micStatus').classList.remove('active'); $('#micStatus').innerHTML = '<span class="status-pulse"></span> MICROPHONE OFF';
  $$('.visualizer-bar').forEach(bar => bar.style.height = `${5 + Math.random() * 8}%`);
  ['inputLevel', 'bassLevel', 'midLevel', 'trebleLevel'].forEach(id => { $(`#${id}`).textContent = '0%'; });
  sendCommand('music', { mode: 'off', level: 0, bass: 0, mid: 0, treble: 0 });
}

function setMusicMode(mode) {
  state.musicMode = mode;
  $$('.music-mode').forEach(button => button.classList.toggle('active', button.dataset.mode === mode));
  sendCommand('musicMode', { mode });
}

function updateTopicPreview() {
  const topic = $('#mqttTopic').value.trim().replace(/\/+$/, '') || DEFAULT_TOPIC_ROOT;
  $('#commandTopicPreview').textContent = `${topic}/command`;
  $('#stateTopicPreview').textContent = `${topic}/state`;
}

function bindEvents() {
  $$('[data-page]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
  $('#themeToggle').addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
  $$('.theme-option').forEach(button => button.addEventListener('click', () => applyTheme(button.dataset.themeChoice)));
  $('#menuButton').addEventListener('click', () => $('#sidebar').classList.toggle('mobile-open'));
  $('#brightnessSlider').addEventListener('input', event => setBrightness(event.target.value));
  $('#speedSlider').addEventListener('input', event => setSpeed(event.target.value));
  $('#powerSwitch').addEventListener('click', () => setPower(!state.power));
  $('#heroPower').addEventListener('click', () => setPower(!state.power));
  $('#hueWheel').addEventListener('pointerdown', event => { $('#hueWheel').setPointerCapture(event.pointerId); hueFromPointer(event); });
  $('#hueWheel').addEventListener('pointermove', event => { if (event.buttons || event.pressure > 0) hueFromPointer(event); });
  $('#hueWheel').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); state.hue = (state.hue + 355) % 360; renderColor(true); }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); state.hue = (state.hue + 5) % 360; renderColor(true); }
  });
  $('#saturationSlider').addEventListener('input', event => { state.saturation = Number(event.target.value); renderColor(true); });
  $('#colorLightnessSlider').addEventListener('input', event => { state.intensity = Number(event.target.value); renderColor(true); });
  $('#hexInput').addEventListener('change', event => { if (setColorFromHex(event.target.value, true)) toast('Custom color applied.'); else event.target.value = state.color.slice(1); });
  $('#applyColor').addEventListener('click', () => {
    const sent = sendCommand('color', { hex: state.color, ...hsvToRgb(state.hue, state.saturation, state.intensity) });
    setEffect('solid');
    setPower(true);
    toast(sent ? `${state.color} sent to the controller.` : `${state.color} updated in preview. Connect the controller to send it.`);
  });
  $('#randomColor').addEventListener('click', () => { state.hue = Math.random() * 360; state.saturation = 60 + Math.random() * 40; state.intensity = 78 + Math.random() * 22; renderColor(false); });
  $('#saveColorPreset').addEventListener('click', () => savePreset(`${state.color} color`, { color: state.color, effect: 'solid', brightness: state.brightness }));
  $('#saveCurrentPreset').addEventListener('click', promptSavePreset);
  $('#shufflePalette').addEventListener('click', () => {
    const baseHue = Math.floor(Math.random() * 360);
    const palette = Array.from({ length: 8 }, (_, i) => rgbToHex(hsvToRgb((baseHue + i * 43 + Math.random() * 16) % 360, 55 + Math.random() * 40, 78 + Math.random() * 22)));
    renderPalette(palette);
  });
  $$('.filter-tab').forEach(button => button.addEventListener('click', () => {
    state.effectFilter = button.dataset.filter;
    $$('.filter-tab').forEach(tab => tab.classList.toggle('active', tab === button));
    renderEffects();
  }));
  $('#effectSearch').addEventListener('input', event => { state.effectSearch = event.target.value; renderEffects(); });
  $('#micButton').addEventListener('click', () => state.audioStream ? stopMicrophone() : startMicrophone());
  $$('.music-mode').forEach(button => button.addEventListener('click', () => setMusicMode(button.dataset.mode)));
  $('#sensitivitySlider').addEventListener('input', event => { state.sensitivity = Number(event.target.value); $('#sensitivityValue').textContent = `${state.sensitivity}%`; });
  $('#connectionForm').addEventListener('submit', connectMqtt);
  $('#disconnectButton').addEventListener('click', disconnectMqtt);
  $('#mqttTopic').addEventListener('input', updateTopicPreview);
  window.addEventListener('resize', () => updateWheelThumb());
  window.addEventListener('beforeunload', () => { if (state.audioStream) stopMicrophone(); });
}

function updateClock() {
  const now = new Date();
  $('#localTime').textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
}

function initialize() {
  loadStoredState();
  bindEvents();
  createVisualizerBars();
  renderPopularEffects(); renderEffects(); renderPalette(); renderPresets();
  renderColor(false); setBrightness(75, false); setSpeed(55, false); setPower(true, false); setEffect('rainbow', false);
  updateClock(); updateTopicPreview();
  // The interface starts in local preview mode until a broker and matching ESP32 firmware are configured.
  setConnectionUi(false);
  window.setTimeout(updateWheelThumb, 60);
}

document.addEventListener('DOMContentLoaded', initialize);
