const canvas = document.getElementById('museum-canvas');
const ctx = canvas.getContext('2d');

const squares = [
  { color: 'rgb(20, 20, 90)' },    // deep blue
  { color: 'rgb(210, 150, 20)' },  // gold
  { color: 'rgb(200, 40, 120)' },  // magenta
  { color: 'rgb(20, 190, 190)' },  // teal
  { color: 'rgb(90, 20, 20)' },    // dark red
  { color: 'rgb(20, 90, 20)' },    // dark green
];

const cols = 3;
const rows = 2;
const bentoPaddingRatio = 0.01; // doubled from 0.005
const blockGapRatio = 0.02; // doubled from 0.01
const bentoRadiusRatio = 0.06; // % of min(windowW, windowH) for bento box border radius
const blockRadiusRatio = 0.04; // % of min(bentoW, bentoH) for block border radius
const internalBlockRadiusRatio = 0.4; // 40% of bentoRadius for internal corners
const bentoBoxColor = '#fff';
const bgColor = '#dddddd';
let cursorRadius = 36;

// Add locked property to each square
for (let i = 0; i < squares.length; i++) {
  squares[i].locked = false;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawMuseum() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate bento box size and position
  const minDim = Math.min(canvas.width, canvas.height);
  const bentoPadding = minDim * bentoPaddingRatio;
  const bentoW = canvas.width - 2 * bentoPadding;
  const bentoH = canvas.height - 2 * bentoPadding;
  const bentoX = bentoPadding;
  const bentoY = bentoPadding;
  const bentoRadius = minDim * bentoRadiusRatio;

  // Draw bento box
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(bentoX + bentoRadius, bentoY);
  ctx.arcTo(bentoX + bentoW, bentoY, bentoX + bentoW, bentoY + bentoH, bentoRadius);
  ctx.arcTo(bentoX + bentoW, bentoY + bentoH, bentoX, bentoY + bentoH, bentoRadius);
  ctx.arcTo(bentoX, bentoY + bentoH, bentoX, bentoY, bentoRadius);
  ctx.arcTo(bentoX, bentoY, bentoX + bentoW, bentoY, bentoRadius);
  ctx.closePath();
  ctx.fillStyle = bentoBoxColor;
  ctx.shadowColor = 'rgba(0,0,0,0.08)';
  ctx.shadowBlur = 32;
  ctx.fill();
  ctx.restore();

  // Calculate block sizes and positions
  const blockGap = Math.min(bentoW, bentoH) * blockGapRatio;
  const blockW = (bentoW - blockGap * (cols + 1)) / cols;
  const blockH = (bentoH - blockGap * (rows + 1)) / rows;
  const blockRadius = Math.min(bentoW, bentoH) * blockRadiusRatio;

  // Draw color blocks
  for (let i = 0; i < squares.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = bentoX + blockGap + col * (blockW + blockGap);
    const y = bentoY + blockGap + row * (blockH + blockGap);

    // Determine which corners should be rounded
    // Order: [top-left, top-right, bottom-right, bottom-left]
    // Use bentoRadius for outer corners, internalBlockRadius for inner
    const internalBlockRadius = bentoRadius * internalBlockRadiusRatio;
    const radii = [internalBlockRadius, internalBlockRadius, internalBlockRadius, internalBlockRadius];
    if (row === 0 && col === 0) radii[0] = bentoRadius; // top-left outer
    if (row === 0 && col === cols - 1) radii[1] = bentoRadius; // top-right outer
    if (row === rows - 1 && col === cols - 1) radii[2] = bentoRadius; // bottom-right outer
    if (row === rows - 1 && col === 0) radii[3] = bentoRadius; // bottom-left outer

    ctx.save();
    ctx.beginPath();
    // Custom rounded rect with per-corner radii
    ctx.moveTo(x + radii[0], y);
    ctx.lineTo(x + blockW - radii[1], y);
    if (radii[1]) ctx.quadraticCurveTo(x + blockW, y, x + blockW, y + radii[1]);
    else ctx.lineTo(x + blockW, y);
    ctx.lineTo(x + blockW, y + blockH - radii[2]);
    if (radii[2]) ctx.quadraticCurveTo(x + blockW, y + blockH, x + blockW - radii[2], y + blockH);
    else ctx.lineTo(x + blockW, y + blockH);
    ctx.lineTo(x + radii[3], y + blockH);
    if (radii[3]) ctx.quadraticCurveTo(x, y + blockH, x, y + blockH - radii[3]);
    else ctx.lineTo(x, y + blockH);
    ctx.lineTo(x, y + radii[0]);
    if (radii[0]) ctx.quadraticCurveTo(x, y, x + radii[0], y);
    else ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = squares[i].color;
    ctx.shadowColor = 'rgba(0,0,0,0.04)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();

    // Draw lock indicator if locked
    if (squares[i].locked) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + blockW - 24, y + 24, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fill();
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Simple lock shackle
      ctx.beginPath();
      ctx.arc(x + blockW - 24, y + 24, 6, Math.PI * 0.75, Math.PI * 0.25, false);
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  }

  // Update cursor radius based on window size
  cursorRadius = Math.max(12, Math.min(canvas.width, canvas.height) * 0.03);
}

resizeCanvas();
drawMuseum();

window.addEventListener('resize', () => {
  resizeCanvas();
  drawMuseum();
});

canvas.style.cursor = 'none';

canvas.addEventListener('mousemove', (e) => {
  drawMuseum();

  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const size = cursorRadius * 2;

  // Use an offscreen canvas for the inverted square
  const off = document.createElement('canvas');
  off.width = size;
  off.height = size;
  const offCtx = off.getContext('2d');

  // Copy the area under the cursor to the offscreen canvas
  offCtx.drawImage(
    canvas,
    mx - cursorRadius, my - cursorRadius, size, size,
    0, 0, size, size
  );

  // Invert the pixels in the offscreen canvas (no manual alpha masking)
  const imgData = offCtx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];     // R
    data[i + 1] = 255 - data[i + 1]; // G
    data[i + 2] = 255 - data[i + 2]; // B
    // alpha stays the same
  }
  offCtx.putImageData(imgData, 0, 0);

  // Draw the inverted circle onto the main canvas using a clipping path (antialiased)
  ctx.save();
  ctx.beginPath();
  ctx.arc(mx, my, cursorRadius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(off, mx - cursorRadius, my - cursorRadius);
  ctx.restore();
});

canvas.addEventListener('mouseleave', () => {
  drawMuseum();
});

function hslDistance(hsl1, hsl2) {
  // hsl1, hsl2: {h, s, l}
  // Only compare hue for simplicity
  let dh = Math.abs(hsl1.h - hsl2.h);
  if (dh > 180) dh = 360 - dh;
  return dh;
}

function parseHSL(str) {
  // str: 'hsl(h, s%, l%)'
  const match = str.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
  if (!match) return {h:0,s:0,l:0};
  return { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) };
}

function randomRichColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.random() * 30;
  const l = 35 + Math.random() * 25;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function generateDistinctColors(n) {
  const colors = [];
  const minHueDist = 40; // degrees
  for (let i = 0; i < n; i++) {
    let tries = 0;
    let color, hsl, ok;
    do {
      color = randomRichColor();
      hsl = parseHSL(color);
      ok = true;
      for (let j = 0; j < colors.length; j++) {
        if (hslDistance(hsl, parseHSL(colors[j])) < minHueDist) {
          ok = false;
          break;
        }
      }
      tries++;
    } while (!ok && tries < 10);
    colors.push(color);
  }
  return colors;
}

canvas.addEventListener('click', () => {
  // Only generate new colors for unlocked blocks
  const unlockedIndices = squares.map((sq, i) => sq.locked ? -1 : i).filter(i => i !== -1);
  const newColors = generateDistinctColors(unlockedIndices.length);
  let colorIdx = 0;
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i].locked) {
      squares[i].color = newColors[colorIdx++];
    }
    // locked blocks keep their color and position
  }
  drawMuseum();
});

canvas.addEventListener('dblclick', (e) => {
  // Find which block was double-clicked
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // Calculate bento box and block sizes as in drawMuseum
  const minDim = Math.min(canvas.width, canvas.height);
  const bentoPadding = minDim * bentoPaddingRatio;
  const bentoW = canvas.width - 2 * bentoPadding;
  const bentoH = canvas.height - 2 * bentoPadding;
  const bentoX = bentoPadding;
  const bentoY = bentoPadding;
  const blockGap = Math.min(bentoW, bentoH) * blockGapRatio;
  const blockW = (bentoW - blockGap * (cols + 1)) / cols;
  const blockH = (bentoH - blockGap * (rows + 1)) / rows;

  for (let i = 0; i < squares.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = bentoX + blockGap + col * (blockW + blockGap);
    const y = bentoY + blockGap + row * (blockH + blockGap);
    if (
      mx >= x && mx <= x + blockW &&
      my >= y && my <= y + blockH
    ) {
      squares[i].locked = !squares[i].locked;
      drawMuseum();
      break;
    }
  }
}); 