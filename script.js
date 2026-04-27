  const fill = document.getElementById('scrollFill');
  const percent = document.getElementById('scrollPercent');
  const mainDrone = document.getElementById('mainDrone');

  // 섹션1 드론 page 좌표: top=0, left=340
  // 섹션2 드론 page 좌표: top=970(1080-110), left=352(calc(50%+52px)-translateX(50%) for 1920px)
  const S1_TOP = 0, S1_LEFT = 340;
  const S2_TOP = 970, S2_LEFT = 352;
  const SECTION1_H = 1080;
  const sec2Els = document.querySelectorAll('.desc-left, .desc-right, .desc-anno-left, .desc-anno-right, .desc-ellipse');
  let sec2Revealed = false;

  function getOffset() {
    return Math.max(0, (window.innerWidth - 1920) / 2);
  }

  function updateDrone() {
    const scale = Math.min(1, window.innerWidth / 1920);
    const scrollY = window.scrollY / scale;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight) / scale;
    const animEnd = Math.min(SECTION1_H, maxScroll);
    const offset = getOffset();

    const t = Math.min(1, scrollY / animEnd);
    const top = t < 1 ? (S2_TOP - animEnd) * t : S2_TOP - scrollY;
    // scale-wrap 적용 시 fixed 요소는 실제 화면 픽셀 기준으로 위치 설정
    const left = offset + S2_LEFT;

    mainDrone.style.top  = (top * scale) + 'px';
    mainDrone.style.left = (left * scale) + 'px';

    if (t >= 1 && !sec2Revealed) {
      sec2Revealed = true;
      sec2Els.forEach(el => el.style.opacity = '1');
    } else if (t < 1 && sec2Revealed) {
      sec2Revealed = false;
      sec2Els.forEach(el => el.style.opacity = '0');
    }

  }

  window.addEventListener('resize', updateDrone);

  function updateScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const pct = Math.round(progress * 100);
    fill.style.width = pct + '%';
    percent.textContent = String(pct).padStart(2, '0') + '%';
  }

  window.addEventListener('scroll', () => {
    updateDrone();
    updateScroll();
  });

  updateDrone();

  // ── SECTION 4 캐러셀 (무한루프) ──
  const leftTrack  = document.getElementById('hdrLeftTrack');
  const rightTrack = document.getElementById('hdrRightTrack');
  const HDR_COUNT = 5;
  const SLIDE_W = 930;
  const TRANSITION = '0.6s ease';

  // 슬라이드 복제 (1~5 뒤에 1~5 붙이기)
  [...leftTrack.children].forEach(el => leftTrack.appendChild(el.cloneNode(true)));
  [...rightTrack.children].forEach(el => rightTrack.appendChild(el.cloneNode(true)));
  leftTrack.style.width  = `${SLIDE_W * HDR_COUNT * 2}px`;
  rightTrack.style.width = `${SLIDE_W * HDR_COUNT * 2}px`;

  let hdrIndex = 0;
  const hdrBars = document.querySelectorAll('.hdr-indicator-bar');

  function updateHdrIndicator(idx) {
    hdrBars.forEach((bar, i) => bar.classList.toggle('active', i === idx));
  }

  function advanceHdr() {
    hdrIndex++;
    leftTrack.style.transition  = TRANSITION;
    rightTrack.style.transition = TRANSITION;
    leftTrack.style.transform  = `translateX(-${hdrIndex * SLIDE_W}px)`;
    rightTrack.style.transform = `translateX(-${hdrIndex * SLIDE_W}px)`;
    updateHdrIndicator(hdrIndex % HDR_COUNT);

    // 복제 구간 끝나면 애니메이션 없이 원위치
    if (hdrIndex === HDR_COUNT) {
      setTimeout(() => {
        leftTrack.style.transition  = 'none';
        rightTrack.style.transition = 'none';
        hdrIndex = 0;
        leftTrack.style.transform  = 'translateX(0)';
        rightTrack.style.transform = 'translateX(0)';
      }, 600);
    }
  }

  setInterval(advanceHdr, 4000);

  // ── SECTION 5 RAW 캐러셀 ──
  const rawTrack = document.getElementById('rawTrack');
  const rawSlides = Array.from(rawTrack.querySelectorAll('.raw-slide'));
  const RAW_COUNT = 5;
  const RAW_STEP = 1180; // 1080px (inactive width) + 100px (gap)
  let rawActive = 0;

  function goToRaw(n) {
    rawSlides[rawActive].classList.remove('active');
    rawActive = (n + RAW_COUNT) % RAW_COUNT;
    rawSlides[rawActive].classList.add('active');
    rawTrack.style.transform = `translateX(-${rawActive * RAW_STEP}px)`;
  }

  document.getElementById('rawPrev').addEventListener('click', () => goToRaw(rawActive - 1));
  document.getElementById('rawNext').addEventListener('click', () => goToRaw(rawActive + 1));

  // ── SECTION 8 텍스트 슬라이드인 ──
  const senseWrapper = document.querySelector('.sense-wrapper');
  const senseSection = document.querySelector('.sense-section');
  const senseTitle1  = document.querySelector('.sense-title-1');
  const senseTitle2  = document.querySelector('.sense-title-2');
  const senseDesc    = document.querySelector('.sense-desc');
  const senseVideo   = document.getElementById('senseVideo');
  let senseDescShown = false;

  // 초기 비디오 크기/위치 (최종 높이는 실제 뷰포트 기준)
  const V_W0 = 614, V_H0 = 320, V_L0 = 653, V_T0 = 380;
  const V_W1 = 1920, V_L1 = 0, V_T1 = 0;

  function updateSenseAnim() {
    const sectionRect = senseSection.getBoundingClientRect();
    const wrapperRect = senseWrapper.getBoundingClientRect();
    const vh = window.innerHeight;

    // 텍스트 슬라이드인: 섹션 하단 진입(t=0) → 섹션 상단 = 뷰포트 상단(t=1)
    const textT = Math.max(0, Math.min(1, (vh - sectionRect.top) / vh));
    const offset = (1 - textT) * 1920;
    senseTitle1.style.transform = `translateX(calc(-50% - ${offset}px))`;
    senseTitle2.style.transform = `translateX(calc(-50% + ${offset}px))`;

    if (textT >= 1 && !senseDescShown) {
      senseDescShown = true;
      senseDesc.style.opacity = '1';
    } else if (textT < 1 && senseDescShown) {
      senseDescShown = false;
      senseDesc.style.opacity = '0';
    }

    // 비디오 확장: sticky 구간에서 wrapper top이 0→-vh 될 때
    const videoT = Math.max(0, Math.min(1, -wrapperRect.top / vh));
    const V_H1 = vh;
    const w = V_W0 + (V_W1 - V_W0) * videoT;
    const h = V_H0 + (V_H1 - V_H0) * videoT;
    const l = V_L0 + (V_L1 - V_L0) * videoT;
    const vt = V_T0 + (V_T1 - V_T0) * videoT;
    const r = videoT >= 1 ? 0 : 10;
    senseVideo.style.width        = w + 'px';
    senseVideo.style.height       = h + 'px';
    senseVideo.style.left         = l + 'px';
    senseVideo.style.top          = vt + 'px';
    senseVideo.style.borderRadius = r + 'px';
  }

  window.addEventListener('scroll', updateSenseAnim);
  updateSenseAnim();

  // ── 섹션 11 카드 확장 ──
  const masterWrapper = document.querySelector('.master-wrapper');
  const masterCard    = document.getElementById('masterCard');
  const secondCard    = document.getElementById('secondCard');
  const scTitle       = secondCard.querySelector('.sc-title');
  const scSub         = secondCard.querySelector('.sc-sub');
  const scDescBox     = secondCard.querySelector('.sc-desc-box');
  const masterTitle   = document.querySelector('.master-title');
  const masterSub     = document.querySelector('.master-sub');
  const mcTitle       = masterCard.querySelector('.mc-title');
  const mcSub         = masterCard.querySelector('.mc-sub');
  const mcDescBox     = masterCard.querySelector('.mc-desc-box');
  const MC_W0 = 532,  MC_H0 = 280;
  const MC_W1 = 1760, MC_H1 = 924;

  function updateMasterAnim() {
    const wrapperRect = masterWrapper.getBoundingClientRect();
    const vh = window.innerHeight;
    const t  = Math.max(0, Math.min(1, -wrapperRect.top / vh));
    const t2 = Math.max(0, Math.min(1, (-wrapperRect.top - vh) / 1000));
    const tb = Math.max(0, (t2 - 0.5) / 0.5);

    // masterCard: phase에 따라 항상 명시적으로 포지셔닝 설정
    if (t2 === 0) {
      // Phase 1: bottom 고정 + 확장
      masterCard.style.bottom  = '20px';
      masterCard.style.top     = 'auto';
      masterCard.style.width   = (MC_W0 + (MC_W1 - MC_W0) * t) + 'px';
      masterCard.style.height  = (MC_H0 + (MC_H1 - MC_H0) * t) + 'px';
      masterCard.style.filter  = '';
      masterCard.style.opacity = '1';
    } else if (tb > 0) {
      // Phase 2b: 상단 고정 + 축소 + blur
      masterCard.style.top     = (vh - 20 - MC_H1) + 'px';
      masterCard.style.bottom  = 'auto';
      masterCard.style.width   = (MC_W1 - (MC_W1 - 1600) * tb) + 'px';
      masterCard.style.height  = (MC_H1 - (MC_H1 - 840)  * tb) + 'px';
      masterCard.style.filter  = `blur(${12 * tb}px)`;
      masterCard.style.opacity = t2 >= 1 ? '0' : '1';
    } else {
      // Phase 2a: 최대 크기, 상단 고정
      masterCard.style.top     = (vh - 20 - MC_H1) + 'px';
      masterCard.style.bottom  = 'auto';
      masterCard.style.width   = MC_W1 + 'px';
      masterCard.style.height  = MC_H1 + 'px';
      masterCard.style.filter  = '';
      masterCard.style.opacity = '1';
    }

    masterTitle.style.opacity = 1 - t;
    masterSub.style.opacity   = 1 - t;
    const overlayOpacity = t >= 1 ? 1 : 0;
    mcTitle.style.opacity   = overlayOpacity;
    mcSub.style.opacity     = overlayOpacity;
    mcDescBox.style.opacity = overlayOpacity;

    // Phase 2: secondCard 슬라이드업
    const slideY = (1 - t2) * vh;
    secondCard.style.transform = `translateX(-50%) translateY(${slideY}px)`;
    const scOverlay = t2 >= 1 ? 1 : 0;
    scTitle.style.opacity   = scOverlay;
    scSub.style.opacity     = scOverlay;
    scDescBox.style.opacity = scOverlay;
  }

  window.addEventListener('scroll', updateMasterAnim);
  updateMasterAnim();


  // ── 섹션 12 캡 메뉴 ──
  const capMenuEl = document.getElementById('capMenu');
  const capMenuBg = document.getElementById('capMenuBg');
  const capItems  = Array.from(capMenuEl.querySelectorAll('.cap-item'));
  const capDesc   = document.getElementById('capDesc');
  const capVideo  = document.getElementById('capVideo');
  const capVideos = [
    'assets/videos/cap-feat-1.webm',
    'assets/videos/cap-feat-2.webm',
    'assets/videos/cap-feat-3.webm',
    'assets/videos/cap-feat-4.webm',
    'assets/videos/cap-feat-5.webm'
  ];
  const capDescs  = [
    'Experience visual assistance from the front, back, left, and right. Simply tap the screen to switch the Vision Assist view and see obstacles from various directions on the flight. This heightened awareness makes every flight feel fully secure.',
    'Plan your flight path in advance with precise waypoints. The drone will follow your exact route autonomously, letting you focus on capturing the perfect shot every time.',
    'Maintain a constant flight speed with cruise control, keeping your footage smooth and stable while you concentrate on framing your subject.',
    'Advanced Return-to-Home ensures your drone safely navigates back to its launch point, even in complex environments with obstacles.',
    'Immerse yourself in the flight with a first-person view experience, giving you real-time perspective as if you were soaring through the sky.'
  ];

  function moveBg(item) {
    const menuRect = capMenuEl.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const pt = parseFloat(getComputedStyle(item).paddingTop) || 0;
    capMenuBg.style.top    = (itemRect.top - menuRect.top + pt - 8) + 'px';
    capMenuBg.style.height = (itemRect.height - pt + 16) + 'px';
  }

  capItems.forEach(item => {
    item.addEventListener('click', () => {
      capItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      moveBg(item);
      const idx = parseInt(item.dataset.index);
      capDesc.textContent = capDescs[idx];
      if (capVideos[idx]) {
        capVideo.src = capVideos[idx];
        capVideo.style.display = 'block';
        capVideo.play();
      } else {
        capVideo.style.display = 'none';
      }
    });
  });

  // 초기 bg 위치
  moveBg(capItems[0]);



  // ── 섹션 13 메뉴 ──
  const s13MenuEl = document.getElementById('s13Menu');
  const s13MenuBg = document.getElementById('s13MenuBg');
  const s13Items  = Array.from(s13MenuEl.querySelectorAll('.s13-item'));
  const s13Desc   = document.getElementById('s13Desc');
  const s13Video  = document.getElementById('s13Video');
  const s13Img    = document.getElementById('s13Img');
  const s13Media  = [
    { type: 'video', src: 'assets/videos/s13-feat-1.webm' },
    { type: 'video', src: 'assets/videos/s13-feat-2.webm' },
    { type: 'video', src: 'assets/videos/s13-feat-3.webm' },
    { type: 'image', src: 'assets/images/s13-feat-4.jpg' },
    { type: 'image', src: 'assets/images/s13-feat-5.jpg' }
  ];
  const s13Descs  = [
    'Delivers dynamic camera movement templates tailored for portrait, close-up, and long-range shots, ensuring you nail every shot!',
    'Choose from Dronie, Circle, Helix, Rocket, Boomerang, and Asteroid for automated cinematic shots with a single tap.',
    'Capture stunning time-lapse videos with Free, Circle, Course Lock, and Waypoint modes for mesmerizing footage.',
    'Shoot sphere, 180°, wide-angle, and vertical panoramas with ease for breathtaking wide-view imagery.',
    'Transfer footage to your phone at up to 60MB/s with QuickTransfer, so you can share your shots instantly.'
  ];

  function s13MoveBg(item) {
    const menuRect = s13MenuEl.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const pt = parseFloat(getComputedStyle(item).paddingTop) || 0;
    s13MenuBg.style.top    = (itemRect.top - menuRect.top + pt - 8) + 'px';
    s13MenuBg.style.height = (itemRect.height - pt + 16) + 'px';
  }

  s13Items.forEach(item => {
    item.addEventListener('click', () => {
      s13Items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      s13MoveBg(item);
      const idx = parseInt(item.dataset.index);
      s13Desc.textContent = s13Descs[idx];
      const m = s13Media[idx];
      if (m.type === 'video') {
        s13Video.src = m.src;
        s13Video.style.display = 'block';
        s13Img.style.display = 'none';
        s13Video.play();
      } else {
        s13Img.src = m.src;
        s13Img.style.display = 'block';
        s13Video.style.display = 'none';
      }
    });
  });

  s13MoveBg(s13Items[0]);


  // ── 섹션 14 캐러셀 ──
  (function() {
    const track    = document.getElementById('s14Track');
    const cards    = Array.from(track.querySelectorAll('.s14-card'));
    const mainImg  = document.getElementById('s14MainImg');
    const nameEl   = document.getElementById('s14ProductName');
    const descEl   = document.getElementById('s14ProductDesc');
    const btnPrev  = document.getElementById('s14Prev');
    const btnNext  = document.getElementById('s14Next');
    const CARD_W   = 296 + 21;
    let active     = 2;

    function update() {
      cards.forEach((c, i) => c.classList.toggle('active', i === active));
      const c = cards[active];
      mainImg.style.opacity = '0';
      setTimeout(() => { mainImg.src = c.dataset.main; mainImg.style.opacity = '1'; }, 300);
      const name = c.dataset.name;
      nameEl.innerHTML = `<span>${name}</span>`;
      descEl.textContent = c.dataset.desc;

    }

    cards.forEach((c, i) => {
      c.addEventListener('click', () => { active = i; update(); });
    });
    btnPrev.addEventListener('click', () => { active = Math.max(0, active - 1); update(); });
    btnNext.addEventListener('click', () => { active = (active + 1) % cards.length; update(); });
    update();
  })();

  // ── SECTION 6 피처 아코디언 ──
  const featList = document.getElementById('featList');
  const featRows = Array.from(featList.querySelectorAll('.feat-row'));

  featRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      featRows.forEach(r => r.classList.remove('expanded'));
      row.classList.add('expanded');
      featList.classList.add('has-hover');
    });
  });

  featList.addEventListener('mouseleave', () => {
    featRows.forEach(r => r.classList.remove('expanded'));
    featList.classList.remove('has-hover');
  });

  // ── 섹션 3: High-Def Imaging 카드 인터랙션 ──
  (function() {
    var card       = document.querySelector('.imaging-card');
    var section    = document.querySelector('.imaging-section');
    var video      = document.getElementById('imagingVideo');
    if (!card || !section) return;

    var triggered = false;
    // 스크롤 잠금 (checkTrigger에서 즉시 호출)
    var lockedY = 0;
    function lockScroll() { window.scrollTo(0, lockedY); }

    function setClip(t, r, b, l, dur, ease) {
      card.style.transition = dur > 0
        ? 'clip-path ' + dur + 'ms ' + (ease || 'ease') + ', opacity ' + dur + 'ms ease'
        : 'none';
      card.style.clipPath = 'inset(' + t + 'px ' + r + 'px ' + b + 'px ' + l + 'px round 20px)';
    }

    function startAnimation() {
      if (triggered) return;
      triggered = true;

      setClip(520, 940, 520, 940, 0);
      card.style.opacity = '0';

      setTimeout(function() {
        card.style.transition = 'clip-path 200ms ease, opacity 200ms ease';
        card.style.opacity = '1';
        card.style.clipPath = 'inset(519.5px 889.5px 519.5px 889.5px round 20px)';
      }, 300);

      setTimeout(function() {
        card.style.transition = 'clip-path 200ms ease';
        card.style.clipPath = 'inset(520px 940px 520px 940px round 20px)';
      }, 600);

      setTimeout(function() {
        card.style.transition = 'clip-path 700ms cubic-bezier(0.4,0,0.2,1)';
        card.style.clipPath = 'inset(0px 939px 0px 939px round 20px)';
      }, 1200);

      setTimeout(function() {
        card.style.transition = 'clip-path 1600ms cubic-bezier(0.4,0,0.2,1)';
        card.style.clipPath = 'inset(0px 0px 0px 0px round 20px)';
        var tg = card.querySelector('.imaging-title-group');
        var dsc = card.querySelector('.imaging-desc');
        if (tg) tg.classList.add('expanded');
        if (dsc) dsc.classList.add('expanded');
      }, 1900);

      setTimeout(function() {
        window.removeEventListener('scroll', lockScroll);
        if (video) video.play();
      }, 3600);
    }

    function checkTrigger() {
      if (triggered) return;
      var rect  = section.getBoundingClientRect();
      var scale = Math.min(1, window.innerWidth / 1920);
      if (rect.bottom * scale <= window.innerHeight) {
        window.removeEventListener('scroll', checkTrigger);
        // 즉시 스크롤 잠금
        lockedY = window.scrollY;
        window.addEventListener('scroll', lockScroll);
        setTimeout(startAnimation, 1000);
      }
    }

    window.addEventListener('scroll', checkTrigger, { passive: true });
    checkTrigger();
  })();

  // ── 반응형 스케일 ──
  (function() {
    var wrap = document.getElementById('scale-wrap');
    if (!wrap) return;

    function getScale() {
      return Math.min(1, window.innerWidth / 1920);
    }

    function applyScale() {
      var vw = window.innerWidth;
      var scale = getScale();

      if (scale < 1) {
        // 뷰포트가 1920px 미만: scale 축소, top-left 기준
        wrap.style.transform = 'scale(' + scale + ')';
        wrap.style.marginLeft = '0';
        document.body.style.height = wrap.offsetHeight * scale + 'px';
      } else {
        // 뷰포트가 1920px 이상: 스케일 없이 가운데 정렬
        wrap.style.transform = 'none';
        wrap.style.marginLeft = ((vw - 1920) / 2) + 'px';
        document.body.style.height = '';
      }

      var drone = document.querySelector('.main-drone');
      if (drone) {
        drone.style.left = (340 * scale + (vw > 1920 ? (vw - 1920) / 2 : 0)) + 'px';
        drone.style.width = (1320 * scale) + 'px';
        drone.style.height = (1320 * scale) + 'px';
      }

      var si = document.querySelector('.scroll-indicator');
      if (si) {
        si.style.bottom = (40 * scale) + 'px';
        si.style.right = (40 * scale) + 'px';
      }
    }

    applyScale();
    window.addEventListener('resize', applyScale);
  })();
