const $ = (q) => document.querySelector(q);

const els = {
  stars: $("#stars"),
  title: $("#title"),
  typed: $("#typed"),

  revealImg: $("#revealImg"),
  scratch: $("#scratch"),
  audio: $("#audio"),

  passOverlay: $("#passcodeModal"),
  passCard: $(".passcode-card"),
  dots: document.querySelectorAll(".dot"),
  nums: document.querySelectorAll(".num-btn:not(.delete-btn):not(.empty)"),
  del: $("#btnDelete")
};

const CORRECT_PASS = "0608"; // <--- ĐỔI MẬT KHẨU CỦA BẠN TẠI ĐÂY
const TITLE = "Hé nho chị ín👽";
const LETTER =
"Trong lúc chị ngủ quên em sẽ làm cái này choa chị:)), uh thì ngta chỉ mất 15p thôi còn em ỉa ra quần đấy. Em tiện tay trong lúc em làm thêm chống đói thôi nma nhớ đọc cho kĩ, tâm sự cả đêm với chị vui vãi l:)) uh cũng nhờ đấy mà tui bt là ngoài kia cũng lắm kẻ giỏi ng giang hơn tui đó, với cả em nghe chị kể chuyện của chị em có rớt nc mắt đấy mà em đ cho bt đâu thề vẫn cay con chó pitbull nha😠. Nma tht sự thì những người xung quanh chị đẳng cấp vcl, lần đầu em đc mở mang đấy. Tự nhiên chị làm em có động lực cố gắng ghê:)), e cứ nghĩ mình như này so với lứa mình là thỏa mãn vãi l rồi ai ngờ sốc trình độ vãi l:))). Thôi 6đ thpt văn đ bt viết gì nữa, sáng dậy thấy đống này thì em đi làm ròi, ngủ ngon nhé💩. À mà về quê xong ra lại đây là có quà đấy:))), pipi đi ngủ đây";

let currentInput = "";

function updateDots() {
  els.dots.forEach((dot, index) => {
    if (index < currentInput.length) dot.classList.add("active");
    else dot.classList.remove("active");
  });
}

function checkPassword() {
  if (currentInput === CORRECT_PASS) {
    els.passOverlay.classList.add("hidden");
    startEverything();
  } else {
    els.passCard.classList.add("shake");
    if (navigator.vibrate) navigator.vibrate(200);
    
    setTimeout(() => {
      els.passCard.classList.remove("shake");
      currentInput = "";
      updateDots();
    }, 500);
  }
}

els.nums.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentInput.length < 4) {
      currentInput += btn.dataset.val;
      updateDots();
      if (currentInput.length === 4) {
        setTimeout(checkPassword, 200);
      }
    }
  });
});

els.del.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentInput.length > 0) {
    currentInput = currentInput.slice(0, -1);
    updateDots();
  }
});

const sctx = els.stars.getContext("2d");
let SW = 0, SH = 0;
let particles = [];

function makeParticle(randomY = false) {
  const isPink = Math.random() < 0.18;
  return {
    x: Math.random() * SW,
    y: randomY ? Math.random() * SH : SH + Math.random() * 140 * devicePixelRatio,
    r: (Math.random() * 1.8 + 0.4) * devicePixelRatio,
    a: Math.random() * 0.75 + 0.15,
    vx: (Math.random() * 0.26 - 0.13) * devicePixelRatio,
    vy: (Math.random() * 0.60 + 0.25) * devicePixelRatio,
    tw: Math.random() * 0.015 + 0.003,
    pink: isPink
  };
}

function resizeStars() {
  SW = els.stars.width = Math.floor(innerWidth * devicePixelRatio);
  SH = els.stars.height = Math.floor(innerHeight * devicePixelRatio);
  els.stars.style.width = innerWidth + "px";
  els.stars.style.height = innerHeight + "px";

  particles = [];
  const n = Math.floor((innerWidth * innerHeight) / 11000);
  for (let i = 0; i < n; i++) particles.push(makeParticle(true));
}
addEventListener("resize", resizeStars, { passive: true });
resizeStars();

function tickStars() {
  sctx.clearRect(0, 0, SW, SH);

  const g = sctx.createLinearGradient(0, 0, 0, SH);
  g.addColorStop(0, "rgba(0,0,0,0.05)");
  g.addColorStop(1, "rgba(0,0,0,0.22)");
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, SW, SH);

  const t = performance.now();

  for (const p of particles) {
    p.y -= p.vy;
    p.x += p.vx + Math.sin(t * p.tw) * 0.12 * devicePixelRatio;

    const tw = 0.5 + 0.5 * Math.sin(t * p.tw);
    const alpha = Math.max(0.05, Math.min(0.95, p.a * (0.75 + tw * 0.35)));

    if (p.y < -50 * devicePixelRatio) Object.assign(p, makeParticle(false));
    if (p.x < -70 * devicePixelRatio) p.x = SW + 70 * devicePixelRatio;
    if (p.x > SW + 70 * devicePixelRatio) p.x = -70 * devicePixelRatio;

    sctx.globalAlpha = alpha;
    sctx.beginPath();
    sctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    sctx.fillStyle = p.pink ? "rgba(255,120,170,1)" : "rgba(255,255,255,1)";
    sctx.fill();
  }
  requestAnimationFrame(tickStars);
}
tickStars();

let typeTimer = null;
function typewriter(text) {
  if (typeTimer) clearInterval(typeTimer);
  els.typed.textContent = "";
  const t = String(text || "");
  if (!t.trim()) return;
  let i = 0;
  typeTimer = setInterval(() => {
    i = Math.min(i + 1, t.length);
    els.typed.textContent = t.slice(0, i);
    if (i >= t.length) {
      clearInterval(typeTimer);
      typeTimer = null;
    }
  }, 22);
}

const c = els.scratch;
const ctx = c.getContext("2d");
let drawing = false;
let cleared = false;

function drawScratchLayer() {
  const g = ctx.createLinearGradient(0, 0, c.width, c.height);
  g.addColorStop(0, "rgba(255,170,190,1)");
  g.addColorStop(1, "rgba(255,210,225,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);

  for (let i = 0; i < 26; i++) {
    const r = (Math.random() * 28 + 10) * devicePixelRatio;
    const x = Math.random() * c.width;
    const y = Math.random() * c.height;
    ctx.globalAlpha = Math.random() * 0.22 + 0.06;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const label = "Cào nhẹ";
  ctx.save();
  ctx.globalAlpha = 0.86;
  const px = c.width * 0.5;
  const py = c.height * 0.52;
  ctx.font = `${Math.floor(18 * devicePixelRatio)}px "Mali", cursive`;
  const tw = ctx.measureText(label).width;
  const padX = 44 * devicePixelRatio;
  const padY = 18 * devicePixelRatio;
  const w = tw + padX * 2;
  const h = padY * 2 + 8 * devicePixelRatio;
  const x = px - w / 2;
  const y = py - h / 2;
  const rr = 18 * devicePixelRatio;

  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();

  ctx.fillStyle = "rgba(0,0,0,.28)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.25)";
  ctx.lineWidth = 1.2 * devicePixelRatio;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,.92)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, px, py);
  ctx.restore();
}

function resizeScratch() {
  const rect = c.getBoundingClientRect();
  c.width = Math.floor(rect.width * devicePixelRatio);
  c.height = Math.floor(rect.height * devicePixelRatio);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, c.width, c.height);
  cleared = false;
  drawScratchLayer();
  els.revealImg.style.opacity = "1";
}
addEventListener("resize", resizeScratch, { passive: true });

function scratchAt(cx, cy) {
  const rect = c.getBoundingClientRect();
  const x = (cx - rect.left) * devicePixelRatio;
  const y = (cy - rect.top) * devicePixelRatio;
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 22 * devicePixelRatio, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

function getClearedPercent() {
  const img = ctx.getImageData(0, 0, c.width, c.height).data;
  let transparent = 0;
  for (let i = 3; i < img.length; i += 4) {
    if (img[i] === 0) transparent++;
  }
  return transparent / (img.length / 4);
}

function finishScratch() {
  if (cleared) return;
  cleared = true;
  ctx.clearRect(0, 0, c.width, c.height);
}

c.addEventListener("pointerdown", (e) => {
  drawing = true;
  c.setPointerCapture(e.pointerId);
  scratchAt(e.clientX, e.clientY);
});
c.addEventListener("pointermove", (e) => {
  if (!drawing) return;
  scratchAt(e.clientX, e.clientY);
  if (!cleared && getClearedPercent() > 0.45) finishScratch();
});
c.addEventListener("pointerup", () => { drawing = false; });
c.addEventListener("pointercancel", () => { drawing = false; });

let started = false;

async function startMusicFade(duration = 1500, targetVol = 0.9) {
  try {
    const a = els.audio;
    a.volume = 0;
    await a.play();

    const t0 = performance.now();
    const step = (t) => {
      const rawProgress = (t - t0) / duration;
      const p = Math.min(1, Math.max(0, rawProgress));
      
      a.volume = targetVol * p;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  } catch (err) {
    console.warn("Lỗi phát nhạc:", err);
  }
}

function startEverything() {
  if (started) return;
  started = true;
  startMusicFade();
  typewriter(LETTER);
}

/* BOOT */
(function init() {
  els.title.textContent = TITLE;
  els.typed.textContent = "";

  const wait = () => resizeScratch();
  if (els.revealImg.complete) wait();
  else els.revealImg.addEventListener("load", wait, { once: true });
})();
