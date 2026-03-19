/* ============================================================
   DRONE PORTFOLIO — script.js
============================================================ */

// ── Features 슬라이드 (Section 4) ────────────────────────────
// 좌(이미지) + 우(동영상) 각자 프레임 안에서 동시에 우→좌 슬라이드
const featImgTrack = document.getElementById('featImgTrack');
const featVidTrack = document.getElementById('featVidTrack');
const featDots = document.querySelectorAll('.feat-dot');
const FEAT_SLIDE_COUNT = 5;
const FEAT_SLIDE_W = 930;
let featCurrent = 0;
let featAutoTimer = null;
let featLocked = false;

function applyFeatTransform(idx, animated) {
  const t = animated ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
  const tx = `translateX(-${idx * FEAT_SLIDE_W}px)`;
  if (featImgTrack) { featImgTrack.style.transition = t; featImgTrack.style.transform = tx; }
  if (featVidTrack) { featVidTrack.style.transition = t; featVidTrack.style.transform = tx; }
}

function updateFeatDots(idx) {
  featDots.forEach((d, i) => d.classList.toggle('active', i === idx % FEAT_SLIDE_COUNT));
}

function advanceFeat() {
  if (featLocked) return;
  const next = featCurrent + 1;

  if (next < FEAT_SLIDE_COUNT) {
    featCurrent = next;
    applyFeatTransform(featCurrent, true);
    updateFeatDots(featCurrent);
  } else {
    // 5번→클론(인덱스5)으로 우→좌 애니메이션 후, 즉시 0으로 스냅
    featLocked = true;
    applyFeatTransform(FEAT_SLIDE_COUNT, true);
    updateFeatDots(0);
    setTimeout(() => {
      applyFeatTransform(0, false);
      featCurrent = 0;
      featLocked = false;
    }, 720);
  }
}

function startFeatAuto() {
  featAutoTimer = setInterval(advanceFeat, 3500);
}

featDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    if (featLocked) return;
    clearInterval(featAutoTimer);
    featCurrent = i;
    applyFeatTransform(i, true);
    updateFeatDots(i);
    startFeatAuto();
  });
});

applyFeatTransform(0, false);
updateFeatDots(0);
startFeatAuto();

// ── RAW Gallery Slider (Section 5) ──────────────────────────
const rawTrack = document.getElementById('rawGallery');
const rawPrev = document.getElementById('rawPrev');
const rawNext = document.getElementById('rawNext');
const rawItems = document.querySelectorAll('.raw-item');
const RAW_COUNT = 5;
const RAW_STEP = 1180; // inactive width (1080) + gap (100)
let rawActive = 0;

function updateRaw() {
  rawItems.forEach((item, i) => item.classList.toggle('active', i === rawActive));
  if (rawTrack) rawTrack.style.transform = `translateX(-${rawActive * RAW_STEP}px)`;
  if (rawPrev) rawPrev.classList.toggle('raw-hidden', rawActive === 0);
  if (rawNext) rawNext.classList.toggle('raw-hidden', rawActive === RAW_COUNT - 1);
}

if (rawNext) rawNext.addEventListener('click', () => { if (rawActive < RAW_COUNT - 1) { rawActive++; updateRaw(); } });
if (rawPrev) rawPrev.addEventListener('click', () => { if (rawActive > 0) { rawActive--; updateRaw(); } });

updateRaw();

// ── Accessories Slider (Section 15) ─────────────────────────
const accGrid = document.getElementById('accGrid');
const accCards = document.querySelectorAll('.acc-card');
const accPrev = document.getElementById('accPrev');
const accNext = document.getElementById('accNext');
let accActive = 2;

function updateAccessories() {
  accCards.forEach((card, i) => {
    card.classList.toggle('acc-active', i === accActive);
    card.classList.toggle('acc-faded', i !== accActive);
  });

  // Scroll the active card into view
  if (accGrid && accCards[accActive]) {
    const card = accCards[accActive];
    const cardLeft = card.offsetLeft;
    const cardCenter = cardLeft - accGrid.offsetWidth / 2 + card.offsetWidth / 2;
    accGrid.scrollTo({ left: cardCenter, behavior: 'smooth' });
  }
}

if (accNext) {
  accNext.addEventListener('click', () => {
    accActive = Math.min(accActive + 1, accCards.length - 1);
    updateAccessories();
  });
}

if (accPrev) {
  accPrev.addEventListener('click', () => {
    accActive = Math.max(accActive - 1, 0);
    updateAccessories();
  });
}

accCards.forEach((card, i) => {
  card.addEventListener('click', () => {
    accActive = i;
    updateAccessories();
  });
});

// ── Scroll Drone: Section 1 float → Section 2 anchor ─────────
const scrollDrone = document.getElementById('scrollDrone');
const s2Elements = [
  document.querySelector('.desc-anno-left'),
  document.querySelector('.desc-block-left'),
  document.querySelector('.desc-anno-right'),
  document.querySelector('.desc-block-right'),
  document.querySelector('.desc-ellipse'),
];

const DRONE_PAGE_Y = 970;
let droneAnchored  = false;

function triggerSection2Reveal() {
  requestAnimationFrame(() => {
    s2Elements.forEach(el => { if (el) el.classList.add('s2-visible'); });
  });
}

function updateScrollDrone() {
  if (!scrollDrone) return;
  const scrollY = window.scrollY;

  if (scrollY < DRONE_PAGE_Y) {
    scrollDrone.style.top = '0px';

    if (droneAnchored) {
      droneAnchored = false;
      s2Elements.forEach(el => { if (el) el.classList.remove('s2-visible'); });
    }
  } else {
    scrollDrone.style.top = (DRONE_PAGE_Y - scrollY) + 'px';

    if (!droneAnchored) {
      droneAnchored = true;
      triggerSection2Reveal();
    }
  }
}

window.addEventListener('scroll', updateScrollDrone, { passive: true });
updateScrollDrone();

// ── Scroll Progress Indicator ────────────────────────────────
const scrollPercent = document.querySelector('.scroll-right span:last-child');
const scrollLineFill = document.querySelector('.scroll-line-fill');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
  if (scrollPercent) {
    scrollPercent.textContent = String(pct).padStart(2, '0') + '%';
  }
  if (scrollLineFill) {
    scrollLineFill.style.width = pct + '%';
  }
});

// ── Motion Section Scroll Animation (Section 8) ──────────────
const motionSection   = document.querySelector('.motion-section');
const motionWrap      = document.querySelector('.motion-scroll-wrap');
const motionLeft      = document.querySelector('.motion-title:not(.motion-title-right)');
const motionRight     = document.querySelector('.motion-title-right');
const motionDescAnim  = document.querySelector('.motion-desc');
const motionMedia     = document.querySelector('.motion-media');

function updateMotionSection() {
  if (!motionSection) return;

  // Phase 1: 타이틀 슬라이드 (섹션이 뷰포트 진입)
  const rect    = motionSection.getBoundingClientRect();
  const windowH = window.innerHeight;
  const p1 = Math.max(0, Math.min(1, (windowH - rect.top) / windowH));

  if (motionLeft)  motionLeft.style.transform  = `translateX(calc(-50% + ${-2000 * (1 - p1)}px))`;
  if (motionRight) motionRight.style.transform = `translateX(calc(-50% + ${ 2000 * (1 - p1)}px))`;
  if (motionDescAnim) motionDescAnim.classList.toggle('motion-visible', p1 >= 1);

  // Phase 2: 미디어 확대 (sticky 추가 스크롤 3000px)
  if (motionWrap && motionMedia) {
    const wrapRect      = motionWrap.getBoundingClientRect();
    const PHASE2_SCROLL = 3000;
    const p2 = Math.max(0, Math.min(1, -wrapRect.top / PHASE2_SCROLL));

    motionMedia.style.width        = (614  + (1920 - 614)  * p2) + 'px';
    motionMedia.style.height       = (320  + (1080 - 320)  * p2) + 'px';
    motionMedia.style.left         = (653  * (1 - p2)) + 'px';
    motionMedia.style.top          = (380  * (1 - p2)) + 'px';
    motionMedia.style.borderRadius = p2 >= 1 ? '0px' : '10px';
  }
}

window.addEventListener('scroll', updateMotionSection, { passive: true });
updateMotionSection();

// ── Masterpiece Card Expand (Section 11) ─────────────────────
// 동작 흐름:
//   1) 섹션이 뷰포트를 꽉 채울 때까지(sticky 시작 전) → p=0, 카드 532×280 고정
//   2) sticky 상태에서 추가 스크롤 → p: 0→1, 카드 확장 후 다음 섹션으로 전환
const masterpieceWrap     = document.querySelector('.masterpiece-scroll-wrap');
const masterpieceCard     = document.querySelector('.masterpiece-card');
const masterpieceBackCard = document.querySelector('.masterpiece-back-card');
const masterpieceTexts    = document.querySelectorAll('.masterpiece-title, .masterpiece-sub');
const masterpieceOverlay  = document.querySelector('.masterpiece-overlay');

const PHASE1 = 700; // 메인카드 확장
const PHASE2 = 600; // 백카드 전진

function updateMasterpiece() {
  if (!masterpieceWrap || !masterpieceCard) return;

  const scrolled = -masterpieceWrap.getBoundingClientRect().top;

  // ── Phase 1: 메인카드 확장 (0 → PHASE1) ──────────────────
  const p1 = Math.max(0, Math.min(1, scrolled / PHASE1));

  masterpieceCard.style.width  = (532  + (1760 - 532)  * p1) + 'px';
  masterpieceCard.style.height = (280  + (924  - 280)  * p1) + 'px';
  masterpieceCard.style.bottom = (140  + (40   - 140)  * p1) + 'px';

  // 제목/서브 페이드 아웃
  const textOpacity = Math.max(0, 1 - p1 * 2.5);
  masterpieceTexts.forEach(el => { if (el) el.style.opacity = textOpacity; });

  // 오버레이는 p1=0.75~1 구간에서 페이드 인 (백카드는 Phase2에서만)
  const overlayOpacity = Math.max(0, Math.min(1, (p1 - 0.75) / 0.25));
  if (masterpieceOverlay) masterpieceOverlay.style.opacity = overlayOpacity;

  // ── Phase 2: 첫 카드 유지 → 백카드 등장 → 백카드 전진 ────
  const p2 = Math.max(0, Math.min(1, (scrolled - PHASE1) / PHASE2));

  // p2=0~0.35: 첫 카드 유지 구간 (아무것도 안 움직임)
  // p2=0.35~0.65: 백카드 페이드 인
  const backOpacity = Math.max(0, Math.min(1, (p2 - 0.35) / 0.30));
  if (masterpieceBackCard) masterpieceBackCard.style.opacity = backOpacity;

  // p2=0.65~1: 백카드 전진 + 메인카드 슬라이드 아웃
  const p2b = Math.max(0, Math.min(1, (p2 - 0.65) / 0.35));

  if (masterpieceBackCard) {
    masterpieceBackCard.style.width  = (1600 + (1760 - 1600) * p2b) + 'px';
    masterpieceBackCard.style.height = (840  + (924  - 840)  * p2b) + 'px';
    masterpieceBackCard.style.bottom = (204  + (40   - 204)  * p2b) + 'px';
    masterpieceBackCard.style.filter = `blur(${6 * (1 - p2b)}px)`;
    masterpieceBackCard.style.zIndex = p2b > 0 ? '3' : '1';
  }

  // 메인카드: 아래로 내려가면서 페이드 아웃 (p2b 구간)
  masterpieceCard.style.bottom  = (40 - 300 * p2b) + 'px';
  masterpieceCard.style.opacity = Math.max(0, 1 - p2b * 1.5);
}

window.addEventListener('scroll', updateMasterpiece, { passive: true });
updateMasterpiece();

// ── Capabilities Menu ────────────────────────────────────────
const capItems = document.querySelectorAll('.cap-item');
const capDescs = [
  'Experience visual assistance from the front, back, left, and right. Simply tap the screen to switch the Vision Assist view and see obstacles from various directions on the flight. This heightened awareness makes every flight feel fully secure.',
  'Pre-program flight routes and let Mini 4 Pro fly them automatically, enabling repeatable, precise shots of landscapes and structures.',
  'Set a consistent flight speed to keep your footage smooth while you focus on framing the perfect shot.',
  'When signal is lost, the drone automatically returns to its home point using the optimal route, keeping your investment safe.',
  'Fully immersive FPV-style flying with enhanced responsiveness for the most engaging aerial experience.',
];
const capDescEl = document.querySelector('.capabilities-desc p');

capItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    capItems.forEach(c => c.classList.remove('cap-active'));
    item.classList.add('cap-active');
    if (capDescEl && capDescs[i]) capDescEl.textContent = capDescs[i];
  });
});

// ── Versatility Menu ─────────────────────────────────────────
const versItems = document.querySelectorAll('.vers-item span');

versItems.forEach(item => {
  item.addEventListener('click', () => {
    versItems.forEach(v => v.style.opacity = '0.5');
    item.style.opacity = '1';
  });
});
