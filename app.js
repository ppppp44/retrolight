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

const SCENE_PRESETS = [{"id":"scene-1","name":"Neon Tokyo","colors":["#FF2E93","#742CFF","#00E5FF"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in neon tokyo tones.","a":"#FF2E93","b":"#00E5FF","icon":"i-waves","webAnimation":true},{"id":"scene-2","name":"Cyber Lagoon","colors":["#00F5D4","#00BBF9","#5A4BFF"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in cyber lagoon tones.","a":"#00F5D4","b":"#5A4BFF","icon":"i-waves","webAnimation":true},{"id":"scene-3","name":"Vaporwave Plaza","colors":["#FF71CE","#01CDFE","#05FFA1"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in vaporwave plaza tones.","a":"#FF71CE","b":"#05FFA1","icon":"i-waves","webAnimation":true},{"id":"scene-4","name":"Peach Afterglow","colors":["#FF8E72","#FFC09F","#A66CFF"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in peach afterglow tones.","a":"#FF8E72","b":"#A66CFF","icon":"i-waves","webAnimation":true},{"id":"scene-5","name":"Arctic Glass","colors":["#D9F5FF","#75D7FF","#6C83FF"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in arctic glass tones.","a":"#D9F5FF","b":"#6C83FF","icon":"i-waves","webAnimation":true},{"id":"scene-6","name":"Deep Space","colors":["#10002B","#5A189A","#00BBF9"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in deep space tones.","a":"#10002B","b":"#00BBF9","icon":"i-waves","webAnimation":true},{"id":"scene-7","name":"Solar Flare","colors":["#FF3D00","#FF9100","#FFE66D"],"pattern":"flicker","category":"scenes","group":"Curated scene","description":"A flicker animation in solar flare tones.","a":"#FF3D00","b":"#FFE66D","icon":"i-waves","webAnimation":true},{"id":"scene-8","name":"Jellyfish","colors":["#B8F2E6","#AED9E0","#9B8CFF"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in jellyfish tones.","a":"#B8F2E6","b":"#9B8CFF","icon":"i-waves","webAnimation":true},{"id":"scene-9","name":"Dragonfruit","colors":["#FF2E63","#B5179E","#7209B7"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in dragonfruit tones.","a":"#FF2E63","b":"#7209B7","icon":"i-waves","webAnimation":true},{"id":"scene-10","name":"Mint Condition","colors":["#B7F7D8","#4DD4AC","#168AAD"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in mint condition tones.","a":"#B7F7D8","b":"#168AAD","icon":"i-waves","webAnimation":true},{"id":"scene-11","name":"Citrus Pop","colors":["#D9ED00","#FFB703","#FB5607"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in citrus pop tones.","a":"#D9ED00","b":"#FB5607","icon":"i-waves","webAnimation":true},{"id":"scene-12","name":"Blue Hour","colors":["#14213D","#4361EE","#4CC9F0"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in blue hour tones.","a":"#14213D","b":"#4CC9F0","icon":"i-waves","webAnimation":true},{"id":"scene-13","name":"Cherry Cola","colors":["#5A0017","#B21E35","#FF6B6B"],"pattern":"flicker","category":"scenes","group":"Curated scene","description":"A flicker animation in cherry cola tones.","a":"#5A0017","b":"#FF6B6B","icon":"i-waves","webAnimation":true},{"id":"scene-14","name":"Lavender Haze","colors":["#E0AAFF","#C77DFF","#7B2CBF"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in lavender haze tones.","a":"#E0AAFF","b":"#7B2CBF","icon":"i-waves","webAnimation":true},{"id":"scene-15","name":"Electric Lime","colors":["#D7FF00","#7CFF00","#00D084"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in electric lime tones.","a":"#D7FF00","b":"#00D084","icon":"i-waves","webAnimation":true},{"id":"scene-16","name":"Tropical Punch","colors":["#FF595E","#FFCA3A","#8AC926"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in tropical punch tones.","a":"#FF595E","b":"#8AC926","icon":"i-waves","webAnimation":true},{"id":"scene-17","name":"Coral Reef","colors":["#FF6B6B","#F7B267","#4ECDC4"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in coral reef tones.","a":"#FF6B6B","b":"#4ECDC4","icon":"i-waves","webAnimation":true},{"id":"scene-18","name":"Midnight Drive","colors":["#0B132B","#3A506B","#5BC0BE"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in midnight drive tones.","a":"#0B132B","b":"#5BC0BE","icon":"i-waves","webAnimation":true},{"id":"scene-19","name":"Golden Hour","colors":["#FFB703","#FB8500","#FFD6A5"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in golden hour tones.","a":"#FFB703","b":"#FFD6A5","icon":"i-waves","webAnimation":true},{"id":"scene-20","name":"Ultraviolet","colors":["#240046","#7B2CBF","#E0AAFF"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in ultraviolet tones.","a":"#240046","b":"#E0AAFF","icon":"i-waves","webAnimation":true},{"id":"scene-21","name":"Rose Quartz","colors":["#F7CAD0","#F2A2C0","#CDB4DB"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in rose quartz tones.","a":"#F7CAD0","b":"#CDB4DB","icon":"i-waves","webAnimation":true},{"id":"scene-22","name":"Phantom","colors":["#111827","#334155","#A78BFA"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in phantom tones.","a":"#111827","b":"#A78BFA","icon":"i-waves","webAnimation":true},{"id":"scene-23","name":"Emerald City","colors":["#004B3A","#00A878","#B7EFC5"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in emerald city tones.","a":"#004B3A","b":"#B7EFC5","icon":"i-waves","webAnimation":true},{"id":"scene-24","name":"Hot Rod","colors":["#F72585","#FF5400","#FFD60A"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in hot rod tones.","a":"#F72585","b":"#FFD60A","icon":"i-waves","webAnimation":true},{"id":"scene-25","name":"Glacier","colors":["#E0FBFC","#98C1D9","#3D5A80"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in glacier tones.","a":"#E0FBFC","b":"#3D5A80","icon":"i-waves","webAnimation":true},{"id":"scene-26","name":"Magma Chamber","colors":["#5F0F00","#E36414","#FB8B24"],"pattern":"flicker","category":"scenes","group":"Curated scene","description":"A flicker animation in magma chamber tones.","a":"#5F0F00","b":"#FB8B24","icon":"i-waves","webAnimation":true},{"id":"scene-27","name":"Cotton Candy","colors":["#FFAFCC","#BDE0FE","#CDB4DB"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in cotton candy tones.","a":"#FFAFCC","b":"#CDB4DB","icon":"i-waves","webAnimation":true},{"id":"scene-28","name":"Acid Jazz","colors":["#D9ED92","#76C893","#34A0A4"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in acid jazz tones.","a":"#D9ED92","b":"#34A0A4","icon":"i-waves","webAnimation":true},{"id":"scene-29","name":"Laser Grid","colors":["#00F5D4","#F15BB5","#FEE440"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in laser grid tones.","a":"#00F5D4","b":"#FEE440","icon":"i-waves","webAnimation":true},{"id":"scene-30","name":"Blue Raspberry","colors":["#00A6FB","#0582CA","#00F5D4"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in blue raspberry tones.","a":"#00A6FB","b":"#00F5D4","icon":"i-waves","webAnimation":true},{"id":"scene-31","name":"Autumn Leaves","colors":["#7F4F24","#DDA15E","#BC4749"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in autumn leaves tones.","a":"#7F4F24","b":"#BC4749","icon":"i-waves","webAnimation":true},{"id":"scene-32","name":"Sakura Night","colors":["#FFB7C5","#FF5D8F","#845EC2"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in sakura night tones.","a":"#FFB7C5","b":"#845EC2","icon":"i-waves","webAnimation":true},{"id":"scene-33","name":"Desert Mirage","colors":["#E9C46A","#F4A261","#E76F51"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in desert mirage tones.","a":"#E9C46A","b":"#E76F51","icon":"i-waves","webAnimation":true},{"id":"scene-34","name":"Phosphor","colors":["#39FF14","#00CC66","#B7FF5A"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in phosphor tones.","a":"#39FF14","b":"#B7FF5A","icon":"i-waves","webAnimation":true},{"id":"scene-35","name":"Deep Sea","colors":["#03045E","#0077B6","#00B4D8"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in deep sea tones.","a":"#03045E","b":"#00B4D8","icon":"i-waves","webAnimation":true},{"id":"scene-36","name":"Disco Lemon","colors":["#FFF000","#FF7B00","#FF006E"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in disco lemon tones.","a":"#FFF000","b":"#FF006E","icon":"i-waves","webAnimation":true},{"id":"scene-37","name":"Soft Focus","colors":["#F1E4F3","#D5C6E0","#B8D0EB"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in soft focus tones.","a":"#F1E4F3","b":"#B8D0EB","icon":"i-waves","webAnimation":true},{"id":"scene-38","name":"Nightfall","colors":["#191970","#483D8B","#9370DB"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in nightfall tones.","a":"#191970","b":"#9370DB","icon":"i-waves","webAnimation":true},{"id":"scene-39","name":"Peacock","colors":["#006D77","#83C5BE","#E29578"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in peacock tones.","a":"#006D77","b":"#E29578","icon":"i-waves","webAnimation":true},{"id":"scene-40","name":"Firefly","colors":["#172A00","#80B918","#D9ED92"],"pattern":"sparkle","category":"scenes","group":"Curated scene","description":"A sparkle animation in firefly tones.","a":"#172A00","b":"#D9ED92","icon":"i-waves","webAnimation":true},{"id":"scene-41","name":"Crimson Tide","colors":["#590D22","#A4133C","#FF4D6D"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in crimson tide tones.","a":"#590D22","b":"#FF4D6D","icon":"i-waves","webAnimation":true},{"id":"scene-42","name":"Aurora Mint","colors":["#80FFDB","#72EFDD","#5390D9"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in aurora mint tones.","a":"#80FFDB","b":"#5390D9","icon":"i-waves","webAnimation":true},{"id":"scene-43","name":"Candy Circuit","colors":["#FF006E","#FB5607","#8338EC"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in candy circuit tones.","a":"#FF006E","b":"#8338EC","icon":"i-waves","webAnimation":true},{"id":"scene-44","name":"Smoky Quartz","colors":["#463F3A","#8A817C","#E0AFA0"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in smoky quartz tones.","a":"#463F3A","b":"#E0AFA0","icon":"i-waves","webAnimation":true},{"id":"scene-45","name":"Prism Party","colors":["#FF595E","#FFCA3A","#1982C4"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in prism party tones.","a":"#FF595E","b":"#1982C4","icon":"i-waves","webAnimation":true},{"id":"scene-46","name":"Starlight","colors":["#D8E2DC","#FFE5D9","#FFCAD4"],"pattern":"sparkle","category":"scenes","group":"Curated scene","description":"A sparkle animation in starlight tones.","a":"#D8E2DC","b":"#FFCAD4","icon":"i-waves","webAnimation":true},{"id":"scene-47","name":"Monsoon","colors":["#264653","#2A9D8F","#A8DADC"],"pattern":"wave","category":"scenes","group":"Curated scene","description":"A wave animation in monsoon tones.","a":"#264653","b":"#A8DADC","icon":"i-waves","webAnimation":true},{"id":"scene-48","name":"Voltage","colors":["#FEE440","#00BBF9","#9B5DE5"],"pattern":"chase","category":"scenes","group":"Curated scene","description":"A chase animation in voltage tones.","a":"#FEE440","b":"#9B5DE5","icon":"i-waves","webAnimation":true},{"id":"scene-49","name":"Blueberry Ice","colors":["#3A0CA3","#4361EE","#4CC9F0"],"pattern":"breathe","category":"scenes","group":"Curated scene","description":"A breathe animation in blueberry ice tones.","a":"#3A0CA3","b":"#4CC9F0","icon":"i-waves","webAnimation":true},{"id":"scene-50","name":"Ruby Velvet","colors":["#4A001F","#9D174D","#F472B6"],"pattern":"cycle","category":"scenes","group":"Curated scene","description":"A cycle animation in ruby velvet tones.","a":"#4A001F","b":"#F472B6","icon":"i-waves","webAnimation":true}];
EFFECTS.push(...SCENE_PRESETS);

const DEFAULT_PALETTE = ['#8B72FF', '#4C9EFF', '#45D5C1', '#F29A68', '#E96FA9', '#F2D16D', '#D8E5FF', '#72BCEB'];
const state = {
  page: 'overview', theme: 'dark', power: true, brightness: 75, speed: 55,
  hue: 258, saturation: 78, intensity: 100, color: '#8B72FF', effect: 'rainbow',
  effectFilter: 'all', effectSearch: '', musicMode: 'spectrum', sensitivity: 85,
  presets: [], mqttClient: null, mqttConnected: false, deviceOnline: false,
  brokerTopic: DEFAULT_TOPIC_ROOT,
  audioStream: null, audioContext: null, analyser: null, audioFrame: null, audioSourceLabel: null,
  animationTimer: null, activeAnimation: null,
  lastMusicPublish: 0, lastStatusMessage: null, audioAdaptive: null
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
  stopWebAnimation();
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
  if (effect.webAnimation) startWebAnimation({ name:effect.name, colors:effect.colors, pattern:effect.pattern, speed:state.speed });
  else if (send) sendCommand('effect', { id });
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
  const count=$('#effectFilters [data-filter="all"] span'); if(count) count.textContent=String(EFFECTS.length);
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
  const data = { id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`, name: presetName, color: preset.color || state.color, effect: preset.effect || state.effect, brightness: preset.brightness ?? state.brightness, animation: preset.animation || state.activeAnimation || null, createdAt: Date.now() };
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
  if (preset.animation) { state.effect='custom'; startWebAnimation(preset.animation); $('#heroEffect').textContent=preset.animation.name || 'Custom animation'; $('#heroEffectDescription').textContent='Your saved custom color sequence.'; $('#heroMode').textContent='Custom'; }
  else setEffect(preset.effect || 'solid');
  setPower(true);
  toast(`Loaded “${preset.name}”.`);
}
function promptSavePreset() {
  const defaultName = `${EFFECTS.find(effect => effect.id === state.effect)?.name || 'Lighting'} setup`;
  const name = window.prompt('Name this preset:', defaultName);
  if (name === null) return;
  if (!savePreset(name)) toast('Give your preset a name first.', 'error');
}

function blendHex(a,b,t) {
  const A=hexToRgb(a), B=hexToRgb(b);
  return rgbToHex({r:A.r+(B.r-A.r)*t,g:A.g+(B.g-A.g)*t,b:A.b+(B.b-A.b)*t});
}
function readCustomAnimation() {
  const name=($('#customAnimationName').value || 'My animation').trim().slice(0,28);
  const colors=$('#customColors').value.split(/[ ,;]+/).filter(Boolean).map(v=>(v.startsWith('#')?v:'#'+v).toUpperCase());
  if(colors.length<2 || colors.length>8 || colors.some(v=>!hexToRgb(v))) { toast('Enter 2 to 8 valid six-digit hex colors.','error'); return null; }
  return {name,colors,pattern:$('#customPattern').value,speed:Number($('#customSpeed').value)};
}
function stopWebAnimation() { if(state.animationTimer) clearInterval(state.animationTimer); state.animationTimer=null; state.activeAnimation=null; }
function startWebAnimation(animation) {
  stopWebAnimation();
  const cfg={name:animation.name||'Custom animation',colors:animation.colors?.length?animation.colors:['#FF4D6D','#8B72FF'],pattern:animation.pattern||'cycle',speed:clamp(Number(animation.speed??state.speed),1,100)};
  state.activeAnimation=cfg; sendCommand('effect',{id:'solid'}); let tick=0; const baseBrightness=state.brightness;
  const frame=()=>{
    const n=cfg.colors.length, factor=1.7-cfg.speed/100*1.45, phase=tick/(7*factor); let color;
    if(cfg.pattern==='chase') color=cfg.colors[Math.floor(tick/Math.max(1,5*factor))%n];
    else if(cfg.pattern==='sparkle') color=Math.random()>.72?cfg.colors[Math.floor(Math.random()*n)]:cfg.colors[0];
    else if(cfg.pattern==='flicker') color=cfg.colors[Math.random()>.62?1:0];
    else if(cfg.pattern==='breathe') { color=cfg.colors[0]; setBrightness(Math.round(baseBrightness*(.25+(Math.sin(phase*.7)+1)*.375))); }
    else if(cfg.pattern==='wave') { const p=(Math.sin(phase*.65)+1)*.5*(n-1),i=Math.floor(p); color=blendHex(cfg.colors[i],cfg.colors[Math.min(i+1,n-1)],p-i); }
    else { const p=(tick/(9*factor))%n,i=Math.floor(p); color=blendHex(cfg.colors[i],cfg.colors[(i+1)%n],p-i); }
    setColorFromHex(color,true); tick++;
  };
  frame(); state.animationTimer=setInterval(frame,220);
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

async function startAudioCapture(kind) {
  const isDeviceAudio = kind === 'device';
  const captureMethod = isDeviceAudio ? navigator.mediaDevices?.getDisplayMedia : navigator.mediaDevices?.getUserMedia;
  if (!captureMethod) {
    toast(isDeviceAudio ? 'Device audio capture is not supported in this browser.' : 'Microphone access needs a supported browser and a secure page (HTTPS).', 'error'); return;
  }
  try {
    if (state.audioStream) stopAudioCapture();
    const stream = isDeviceAudio
      ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      : await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
    if (isDeviceAudio && stream.getAudioTracks().length === 0) {
      stream.getTracks().forEach(track => track.stop());
      throw new Error('No shared system audio was received. In Chrome, choose your entire screen and enable Share system audio.');
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Web Audio is not available in this browser.');
    const context = new AudioContextClass();
    await context.resume();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 4096;
    analyser.smoothingTimeConstant = 0.14;
    analyser.minDecibels = -92;
    analyser.maxDecibels = -18;
    source.connect(analyser);
    state.audioStream = stream; state.audioContext = context; state.analyser = analyser; state.audioSourceLabel = kind;
    stream.getTracks().forEach(track => track.addEventListener('ended', () => { if (state.audioStream === stream) stopAudioCapture(); }, { once: true }));
    state.audioAdaptive = {
      bass: { floor: 0.006, ceiling: 0.10, smooth: 0 },
      mid: { floor: 0.006, ceiling: 0.10, smooth: 0 },
      treble: { floor: 0.006, ceiling: 0.10, smooth: 0 }
    };
    $('#micButton').innerHTML = `${icon(isDeviceAudio ? 'i-monitor' : 'i-pause', 'icon-small')}<span>${isDeviceAudio ? 'Enable microphone' : 'Stop microphone'}</span>`;
    $('#deviceAudioButton').innerHTML = `${icon(isDeviceAudio ? 'i-pause' : 'i-monitor', 'icon-small')}<span>${isDeviceAudio ? 'Stop device audio' : 'Device audio'}</span>`;
    $('#micStatus').classList.add('active'); $('#micStatus').innerHTML = `<span class="status-pulse"></span> ${isDeviceAudio ? 'DEVICE AUDIO ACTIVE' : 'MICROPHONE ACTIVE'}`;
    $('#inputLevel').innerHTML = '0<span>%</span>';
    toast(`${isDeviceAudio ? 'Device audio' : 'Microphone'} connected. Adaptive analysis is running locally.`);
    analyzeAudio();
  } catch (error) {
    console.error('Microphone could not start:', error);
    toast(error.name === 'NotAllowedError' ? 'Audio capture permission was denied. Check your browser sharing permissions.' : (error.message || 'Could not start audio capture.'), 'error');
  }
}

function analyzeAudio() {
  if (!state.analyser) return;
  const analyser = state.analyser;
  const data = new Uint8Array(analyser.frequencyBinCount);
  const sampleRate = state.audioContext.sampleRate;
  const nyquist = sampleRate / 2;
  const toBin = hz => Math.max(1, Math.floor((hz / nyquist) * data.length));
  const bandEnergy = (startHz, endHz) => {
    const start = clamp(toBin(startHz), 0, data.length - 1);
    const end = clamp(toBin(endHz), start + 1, data.length);
    let squares = 0, peak = 0, count = 0;
    for (let i = start; i < end; i++) {
      const value = data[i] / 255;
      squares += value * value;
      if (value > peak) peak = value;
      count++;
    }
    const rms = Math.sqrt(squares / Math.max(1, count));
    return clamp(rms * 0.72 + peak * 0.28, 0, 1);
  };
  const adaptive = (raw, tracker, sensitivity) => {
    // Slow upward floor tracking prevents quiet, steady music from being gated out.
    // The ceiling follows peaks quickly and relaxes slowly, preserving useful dynamics.
    if (raw < tracker.floor) tracker.floor += (raw - tracker.floor) * 0.075;
    else tracker.floor += (raw - tracker.floor) * 0.0007;
    if (raw > tracker.ceiling) tracker.ceiling += (raw - tracker.ceiling) * 0.22;
    else tracker.ceiling += (raw - tracker.ceiling) * 0.0022;
    const span = Math.max(0.028, tracker.ceiling - tracker.floor);
    const normalized = clamp((raw - tracker.floor) / span, 0, 1);
    const shaped = Math.pow(normalized, 0.68);
    const gain = 0.62 + (sensitivity / 100) * 0.78;
    const target = clamp(shaped * gain, 0, 1);
    const smoothing = target > tracker.smooth ? 0.58 : 0.19;
    tracker.smooth += (target - tracker.smooth) * smoothing;
    return clamp(tracker.smooth * 100, 0, 100);
  };
  const bars = $$('.visualizer-bar');
  const loop = () => {
    if (!state.analyser) return;
    analyser.getByteFrequencyData(data);
    const sensitivity = state.sensitivity;
    const rawBass = bandEnergy(35, 250);
    const rawMid = bandEnergy(250, 2200);
    const rawTreble = bandEnergy(2200, Math.min(12000, nyquist - 1));
    const bass = adaptive(rawBass, state.audioAdaptive.bass, sensitivity);
    const mid = adaptive(rawMid, state.audioAdaptive.mid, sensitivity);
    const treble = adaptive(rawTreble, state.audioAdaptive.treble, sensitivity);
    const weighted = bass * 0.34 + mid * 0.42 + treble * 0.24;
    const strongest = Math.max(bass, mid, treble);
    const level = clamp(weighted * 0.62 + strongest * 0.38, 0, 100);
    $('#inputLevel').innerHTML = `${Math.round(level)}<span>%</span>`;
    $('#bassLevel').textContent = `${Math.round(bass)}%`;
    $('#midLevel').textContent = `${Math.round(mid)}%`;
    $('#trebleLevel').textContent = `${Math.round(treble)}%`;

    const stride = Math.max(1, Math.floor(data.length / bars.length));
    bars.forEach((bar, index) => {
      const raw = data[Math.min(data.length - 1, index * stride)] / 255;
      const shaped = Math.pow(raw, 0.58) * (0.58 + sensitivity / 100);
      bar.style.height = `${Math.max(3, clamp(shaped * 112, 3, 100))}%`;
    });

    const now = performance.now();
    if (state.mqttConnected && now - state.lastMusicPublish > 85) {
      state.lastMusicPublish = now;
      const musicPayload = {
        mode: state.musicMode,
        bass: Math.round(bass),
        mid: Math.round(mid),
        treble: Math.round(treble),
        level: Math.round(level)
      };
      sendCommand('music', musicPayload);
    }
    state.audioFrame = requestAnimationFrame(loop);
  };
  state.audioFrame = requestAnimationFrame(loop);
}

function stopAudioCapture() {
  if (state.audioFrame) cancelAnimationFrame(state.audioFrame);
  state.audioFrame = null; state.analyser = null;
  if (state.audioStream) state.audioStream.getTracks().forEach(track => track.stop());
  state.audioStream = null; state.audioAdaptive = null; state.audioSourceLabel = null;
  if (state.audioContext) state.audioContext.close().catch(() => {});
  state.audioContext = null;
  $('#micButton').innerHTML = `${icon('i-mic', 'icon-small')}<span>Enable microphone</span>`;
  $('#deviceAudioButton').innerHTML = `${icon('i-monitor', 'icon-small')}<span>Device audio</span>`;
  $('#micStatus').classList.remove('active'); $('#micStatus').innerHTML = '<span class="status-pulse"></span> AUDIO INPUT OFF';
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
  $('#customSpeed').addEventListener('input', event => { $('#customSpeedValue').textContent=event.target.value+'%'; });
  $('#customPreview').addEventListener('click', () => { const a=readCustomAnimation(); if(a){state.effect='custom';startWebAnimation(a);$('#heroEffect').textContent=a.name;$('#heroEffectDescription').textContent='Custom animation preview is running.';$('#heroMode').textContent='Custom';setPower(true);toast('Your animation is live.');} });
  $('#customSave').addEventListener('click', () => { const a=readCustomAnimation(); if(a) savePreset(a.name,{color:a.colors[0],effect:'custom',animation:a,brightness:state.brightness}); });
  $('#stopAnimation').addEventListener('click', () => { stopWebAnimation(); setEffect('solid'); sendCommand('color',{hex:state.color,...hexToRgb(state.color)}); toast('Animation stopped.'); });
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
  $('#micButton').addEventListener('click', () => state.audioSourceLabel === 'microphone' ? stopAudioCapture() : startAudioCapture('microphone'));
  $('#deviceAudioButton').addEventListener('click', () => state.audioSourceLabel === 'device' ? stopAudioCapture() : startAudioCapture('device'));
  $$('.music-mode').forEach(button => button.addEventListener('click', () => setMusicMode(button.dataset.mode)));
  $('#sensitivitySlider').addEventListener('input', event => { state.sensitivity = Number(event.target.value); $('#sensitivityValue').textContent = `${state.sensitivity}%`; });
  $('#connectionForm').addEventListener('submit', connectMqtt);
  $('#disconnectButton').addEventListener('click', disconnectMqtt);
  $('#mqttTopic').addEventListener('input', updateTopicPreview);
  window.addEventListener('resize', () => updateWheelThumb());
  window.addEventListener('beforeunload', () => { stopWebAnimation(); if (state.audioStream) stopAudioCapture(); });
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
