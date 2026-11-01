import './style.css';
import { createPet, feedPet, playWithPet } from './care';

type Activity = 'idle' | 'feed' | 'play' | 'sleep';
const canvas = document.querySelector<HTMLCanvasElement>('#room')!;
const context = canvas.getContext('2d');
if (!context) throw new Error('Canvas 2D is required to draw Mochi.');
const ctx = context;
ctx.imageSmoothingEnabled = false;
const status = document.querySelector<HTMLElement>('#pet-status')!;
let pet = createPet();
const messages: Record<Activity, string> = {
  idle: 'Mochi is happy you’re here.',
  feed: 'A tiny snack for a tiny friend.',
  play: 'Mochi has found a favorite toy.',
  sleep: 'A sleepy daydream. This preview leaves energy unchanged.',
};

function rect(x: number, y: number, width: number, height: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x * 2, y * 2, width * 2, height * 2);
}

function draw(activity: Activity) {
  rect(0, 0, 160, 112, '#f1e5cc');
  for (let x = 0; x < 160; x += 12) rect(x, 0, 1, 77, '#eadfc6');
  rect(0, 76, 160, 4, '#bba482');
  rect(0, 80, 160, 32, '#dac09c');
  for (let y = 88; y < 112; y += 10) rect(0, y, 160, 1, '#c9ad89');
  for (let x = 12; x < 160; x += 35) rect(x, 81, 1, 31, '#c9ad89');
  // Window and sunny view.
  rect(19, 15, 36, 42, '#b9a183');
  rect(22, 18, 30, 34, '#b9d9d4');
  rect(43, 21, 5, 5, '#fff3ba');
  rect(24, 37, 6, 3, '#e8f1e2');
  rect(35, 27, 10, 3, '#e8f1e2');
  rect(36, 18, 2, 34, '#e7d9ba');
  rect(22, 34, 30, 2, '#e7d9ba');
  rect(16, 53, 42, 4, '#a48c70');
  rect(15, 13, 5, 36, '#d1b5a0');
  rect(54, 13, 5, 36, '#d1b5a0');
  // Framed flower and a plant on a small stand.
  rect(100, 19, 20, 25, '#bca285');
  rect(102, 21, 16, 21, '#fbf0d6');
  rect(109, 29, 2, 10, '#739a69');
  rect(105, 26, 9, 5, '#dcae93');
  rect(108, 24, 3, 9, '#dcae93');
  rect(109, 28, 2, 2, '#edce91');
  rect(126, 73, 22, 3, '#a0896a');
  rect(128, 76, 2, 16, '#a0896a');
  rect(144, 76, 2, 16, '#a0896a');
  rect(131, 61, 12, 12, '#c79073');
  rect(129, 59, 16, 4, '#d9a183');
  rect(136, 42, 2, 18, '#668860');
  rect(130, 46, 6, 4, '#7f9f6e');
  rect(138, 40, 6, 5, '#8eab77');
  rect(138, 51, 5, 4, '#7f9f6e');
  // Woven rug.
  rect(39, 94, 78, 11, '#bca48d');
  rect(43, 90, 70, 14, '#e7baa0');
  rect(48, 93, 60, 8, '#f2d0b5');
  // Original 16-by-16 pet sprite, drawn at two room pixels per sprite pixel.
  const sprite = [
    '...GG......GG...',
    '..GMMG....GMMG..',
    '..GMMMGGGGMMMG..',
    '..GMMMMMMMMMMG..',
    '.GMMMMMMMMMMMMG.',
    '.GMMMMMMMMMMMMG.',
    'GMMMEEMMMMEEMMMG',
    'GMMMMMMMMMMMMMMG',
    'GMMBMMMMMMMMBMMG',
    'GMMMMMNNMMMMMMMG',
    '.GMMMMMMMMMMMMG.',
    '.GMMMMCCCCMMMMG.',
    '..GMMCCCCCCMMG..',
    '..GMMCCCCCCMMG..',
    '...GGG....GGG...',
    '....GG....GG....',
  ];
  const colors: Record<string, string> = {
    G: '#678a6d', M: '#a9c994', C: '#d5dfad', B: '#e2b19c', E: '#3b5447', N: '#5d7661',
  };
  const petX = 62;
  const petY = activity === 'play' ? 58 : 62;
  sprite.forEach((row, y) => [...row].forEach((pixel, x) => {
    if (pixel === '.' || pixel === ' ') return;
    const color = colors[activity === 'sleep' && pixel === 'E' ? 'M' : pixel];
    if (color) rect(petX + x * 2, petY + y * 2, 2, 2, color);
  }));
  if (activity === 'sleep') {
    rect(70, 75, 4, 1, '#3b5447');
    rect(82, 75, 4, 1, '#3b5447');
    ctx.fillStyle = '#748b73';
    ctx.font = '14px monospace';
    ctx.fillText('z', 199, 120);
    ctx.font = '10px monospace';
    ctx.fillText('z', 214, 105);
  }
  if (activity === 'feed') {
    rect(95, 92, 17, 3, '#e0ab83');
    rect(97, 95, 13, 5, '#bd8d72');
    rect(99, 90, 9, 3, '#956e51');
  }
  if (activity === 'play') {
    rect(62, 48, 2, 6, '#d89792');
    rect(60, 50, 6, 2, '#d89792');
    rect(90, 45, 2, 6, '#d89792');
    rect(88, 47, 6, 2, '#d89792');
    rect(101, 88, 9, 10, '#cb9da6');
    rect(103, 86, 5, 14, '#cb9da6');
    rect(103, 88, 2, 4, '#efd3c8');
    rect(101, 93, 9, 2, '#b58490');
  }
  status.textContent = messages[activity];
  const reaction = { idle: 'rests on the rug', feed: 'enjoys a snack', play: 'bounces beside a pink ball with happy sparkles', sleep: 'daydreams with closed eyes' }[activity];
  canvas.setAttribute('aria-label', `Mochi, a mint-green pixel cat, ${reaction} in a cozy room.`);
}

function renderNeeds() {
  for (const need of ['hunger', 'happiness', 'energy'] as const) {
    const meter = document.querySelector<HTMLMeterElement>('#' + need)!;
    meter.value = pet[need];
    meter.textContent = `${pet[need]} out of 100`;
    document.querySelector('#' + need + '-value')!.textContent = `${pet[need]} / 100`;
  }
}

draw('idle');
renderNeeds();
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-action]');
for (const button of buttons) {
  button.addEventListener('click', () => {
    let activity = button.dataset.action as Activity;
    let message = messages[activity];
    if (activity === 'feed') {
      const wasFull = pet.hunger === 0;
      pet = feedPet(pet);
      message = wasFull
        ? 'Mochi is already full. Save that snack for later.'
        : pet.hunger === 0 ? 'Mochi is full and content.' : `Snack enjoyed! Hunger is now ${pet.hunger} out of 100.`;
    }
    if (activity === 'play') {
      const result = playWithPet(pet);
      pet = result.pet;
      message = result.played
        ? `Mochi bounces with joy! Happiness ${pet.happiness}, energy ${pet.energy}.`
        : 'Mochi is too tired for another game.';
      if (!result.played) activity = 'idle';
    }
    for (const other of buttons) other.setAttribute('aria-pressed', String(other.dataset.action === activity));
    draw(activity);
    renderNeeds();
    status.textContent = message;
  });
}
