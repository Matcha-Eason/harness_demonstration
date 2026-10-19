/* =========================================================
   HARNESS / concept film
   vanilla SVG + CSS + rAF. no dependencies.
   ========================================================= */
(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const LAST = 6;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SCENES = [
    {
      fig: 'FIG. 01',
      title: 'THE BARE LOOP',
      status: 'UNCONSTRAINED',
      tone: 'amber',
      formula: 'y ~ P(· | x)',
      chapter: '裸模型',
      group: 'base'
    },
    {
      fig: 'FIG. 02',
      title: 'ENTROPY SOURCES',
      status: 'N × BRANCHES',
      tone: 'coral',
      formula: 'possible paths ≈ bⁿ',
      chapter: '发散',
      group: 'base'
    },
    {
      fig: 'FIG. 03',
      title: 'THE FIXTURE',
      status: 'HARNESS ON',
      tone: 'blue',
      formula: 'P(y | x, H) → 更集中',
      chapter: '输出夹具',
      group: 'base'
    },
    {
      fig: 'FIG. 04',
      title: 'MULTI-TURN',
      status: 'RECURSIVE DRIFT',
      tone: 'coral',
      formula: 'input(t+1) = output(t) + noise',
      chapter: '多轮递归',
      group: 'turn'
    },
    {
      fig: 'FIG. 05',
      title: 'REWARD BOUNDARY',
      status: 'LEARNING SIGNAL',
      tone: 'mint',
      formula: 'R(y, H) → +1 / −1',
      chapter: '学习信号',
      group: 'learn'
    },
    {
      fig: 'FIG. 06',
      title: 'PRODUCTION DETERMINISM',
      status: 'PRODUCTION READY',
      tone: 'blue',
      formula: 'P(deliverable) ↑',
      chapter: '生产化 Agent',
      group: 'prod'
    },
    {
      fig: 'FIG. 07',
      title: 'SYNTHESIS',
      status: 'MODEL + HARNESS',
      tone: 'amber',
      formula: 'Agent = Model + Harness',
      chapter: '收束',
      group: 'final'
    }
  ];

  const DURATIONS = [15000, 16500, 18000, 18000, 18500, 18500, 16000];

  const stageSvg = document.getElementById('stageSvg');
  const stage = document.getElementById('stage');
  const sceneBase = document.getElementById('sceneBase');
  const sceneTurn = document.getElementById('sceneTurn');
  const sceneLearn = document.getElementById('sceneLearn');
  const sceneProd = document.getElementById('sceneProd');
  const sceneFinal = document.getElementById('sceneFinal');
  const sceneEls = [sceneBase, sceneTurn, sceneLearn, sceneProd, sceneFinal];
  const groupFor = {
    base: sceneBase,
    turn: sceneTurn,
    learn: sceneLearn,
    prod: sceneProd,
    final: sceneFinal
  };

  const storyPanels = [...document.querySelectorAll('.story-panel')];
  const dotsEl = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playBtn = document.getElementById('playBtn');
  const playLabel = document.getElementById('playLabel');
  const autoFill = document.getElementById('autoFill');
  const notesBtn = document.getElementById('notesBtn');
  const notesDialog = document.getElementById('notesDialog');
  const closeNotes = document.getElementById('closeNotes');
  const fullBtn = document.getElementById('fullBtn');
  const toastEl = document.getElementById('toast');

  const figNo = document.getElementById('figNo');
  const figTitle = document.getElementById('figTitle');
  const stageStatus = document.getElementById('stageStatus');
  const statusText = document.getElementById('statusText');
  const tCount = document.getElementById('tCount');
  const tChapter = document.getElementById('tChapter');
  const stageSceneNum = document.getElementById('stageSceneNum');
  const stageFormula = document.getElementById('stageFormula');
  const baseRealMain = document.querySelector('.base-real-main') || document.querySelector('.scene-base .output-card .card-main');

  let current = 0;
  let playing = false;
  let sceneStarted = 0;
  let progress = 0;
  let seen = new Set();
  let toastTimer = 0;
  let swipeStart = null;

  /* ---------------- svg helpers ---------------- */
  function svgEl(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value !== undefined && value !== null) el.setAttribute(key, String(value));
    }
    return el;
  }

  function svgText(content, attrs = {}) {
    const el = svgEl('text', attrs);
    el.textContent = content;
    return el;
  }

  function mulberry32(seed) {
    return function random() {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function curve(x1, y1, x2, y2, bend = 1) {
    const c1x = x1 + (x2 - x1) * 0.34;
    const c2x = x1 + (x2 - x1) * 0.67;
    const c1y = y1 + (y2 - y1) * 0.02 + (y2 - y1) * 0.1 * bend;
    const c2y = y1 + (y2 - y1) * 0.98;
    return `M${x1} ${y1} C${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  }

  function addSmilDot(parent, path, dur, color, delay = 0) {
    const dot = svgEl('circle', { r: 2.3, fill: color, opacity: 0.75, filter: 'url(#fSoft)' });
    const motion = svgEl('animateMotion', { dur: `${dur}s`, repeatCount: 'indefinite', path });
    if (delay) motion.setAttribute('begin', `${delay}s`);
    dot.appendChild(motion);
    parent.appendChild(dot);
    return dot;
  }

  /* ---------------- generated graphics ---------------- */
  function buildBaseFan() {
    const pathsGroup = document.getElementById('baseGhostPaths');
    const labelsGroup = document.getElementById('baseGhostLabels');
    if (!pathsGroup || !labelsGroup) return;

    const samples = [
      { y: 128, idx: '02', text: '换一种解法', code: 'y₂' },
      { y: 196, idx: '03', text: '先澄清约束', code: 'y₃' },
      { y: 264, idx: '04', text: '调用工具核实', code: 'y₄' },
      { y: 446, idx: '05', text: '编造一个 API', code: 'y₅' },
      { y: 514, idx: '06', text: '提前宣布完成', code: 'y₆' },
      { y: 582, idx: '07', text: '把问题交还给人', code: 'y₇' }
    ];

    const extra = [104, 606];
    let order = 0;
    extra.forEach((y) => {
      const path = svgEl('path', {
        d: curve(654, 355, 884, y, 0.55),
        pathLength: 1,
        style: `--i:${order++}`
      });
      pathsGroup.appendChild(path);
    });

    samples.forEach((sample, i) => {
      const path = svgEl('path', {
        d: curve(654, 355, 884, sample.y, 1),
        pathLength: 1,
        style: `--i:${order++}`
      });
      if (i === 0 || i === 2) path.classList.add('sampled');
      pathsGroup.appendChild(path);
      if (i === 0 || i === 3) addSmilDot(pathsGroup, path, 4.8 + i * .4, i === 0 ? '#ffc778' : '#9db9db', i * .7);

      const label = svgEl('g', {
        class: 'ghost-label',
        transform: `translate(884 ${sample.y - 15})`,
        style: `--i:${i}`
      });
      label.appendChild(svgEl('rect', { width: 218, height: 30, rx: 15 }));
      label.appendChild(svgText(sample.idx, { class: 'idx', x: 13, y: 19 }));
      label.appendChild(svgText(sample.text, { x: 34, y: 19 }));
      label.appendChild(svgText(sample.code, { class: 'tag', x: 204, y: 19, 'text-anchor': 'end' }));
      labelsGroup.appendChild(label);
    });
  }

  function addRealMotionDot() {
    const group = document.querySelector('.real-output');
    if (!group) return;
    addSmilDot(group, 'M654 355 C748 355 780 355 888 355', 3.4, '#ffc778', 0.2);
  }

  function buildCloud() {
    const group = document.getElementById('baseCloudDots');
    if (!group) return;
    const random = mulberry32(20260211);
    for (let i = 0; i < 48; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 66 + Math.sqrt(random()) * 168;
      const x = 950 + Math.cos(angle) * radius;
      const y = 355 + Math.sin(angle) * radius * 0.92;
      const dot = svgEl('circle', {
        cx: x.toFixed(1),
        cy: y.toFixed(1),
        r: (0.6 + random() * 1.5).toFixed(2),
        style: `animation-delay:${(-random() * 8).toFixed(2)}s;animation-duration:${(5 + random() * 6).toFixed(2)}s`
      });
      group.appendChild(dot);
    }
  }

  function buildTurnGhosts() {
    const group = document.getElementById('turnGhostPaths');
    if (!group) return;
    const ys = [150, 214, 278, 592, 638];
    ys.forEach((y, i) => {
      const path = svgEl('path', {
        d: curve(654, 452, 1092, y, 0.8),
        pathLength: 1,
        style: `--i:${i}`
      });
      if (i === 4) path.classList.add('warm');
      group.appendChild(path);
    });
    group.appendChild(svgText('without harness → wider branch', {
      x: 1090,
      y: 126,
      'text-anchor': 'end',
      class: 'tiny-annotation dim'
    }));
  }

  function buildLearnFan() {
    const pathsGroup = document.getElementById('learnPaths');
    const endpointsGroup = document.getElementById('learnEndpoints');
    if (!pathsGroup || !endpointsGroup) return;

    const values = [120, 188, 256, 324, 392, 460, 528, 596];
    const accepted = new Set([3, 4, 5]);

    values.forEach((y, i) => {
      const path = curve(304, 380, 716, y, 0.9);
      const pathEl = svgEl('path', {
        d: path,
        pathLength: 1,
        class: accepted.has(i) ? 'accepted' : 'rejected',
        style: `--i:${i}`
      });
      pathsGroup.appendChild(pathEl);

      if (accepted.has(i) && i !== 4) addSmilDot(pathsGroup, path, 3.8 + i * 0.3, '#7fe2b0', i * 0.2);
      if (!accepted.has(i) && i % 3 === 0) addSmilDot(pathsGroup, path, 4.7 + i * 0.2, '#ff7772', i * 0.25);

      const end = svgEl('g', {
        class: `endpoint-group ${accepted.has(i) ? 'accepted' : 'rejected'}`,
        transform: `translate(726 ${y - 10})`
      });
      end.appendChild(svgEl('rect', {
        class: `endpoint ${accepted.has(i) ? 'accepted' : 'rejected'}`,
        width: 44,
        height: 20,
        rx: 10
      }));
      end.appendChild(svgText(accepted.has(i) ? '✓' : '×', {
        x: 10,
        y: 14,
        class: accepted.has(i) ? 'accepted-label' : 'rejected-label'
      }));
      end.appendChild(svgText(`y${String(i + 1).padStart(2, '0')}`, {
        x: 23,
        y: 14,
        class: accepted.has(i) ? 'accepted-label' : 'rejected-label'
      }));
      endpointsGroup.appendChild(end);
    });
  }

  function buildFinalGhosts() {
    const group = document.getElementById('finalGhostPaths');
    if (!group) return;
    const ys = [130, 188, 246, 436, 494, 552];
    ys.forEach((y, i) => {
      group.appendChild(svgEl('path', {
        d: curve(606, 340, 1100, y, 0.7),
        pathLength: 1,
        style: `--i:${i}`
      }));
    });
  }

  function buildDots() {
    SCENES.forEach((scene, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dot';
      button.dataset.index = String(i);
      button.setAttribute('aria-label', `第 ${i + 1} 场：${scene.chapter}`);
      button.innerHTML = `<span class="dot-tip">${String(i + 1).padStart(2, '0')} · ${scene.chapter}</span><span class="dot-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>`;
      button.addEventListener('click', () => {
        manualGo(i);
      });
      dotsEl.appendChild(button);
    });
  }

  const dotButtons = () => [...dotsEl.querySelectorAll('.dot')];

  /* ---------------- scene activation ---------------- */
  function activate(index, opts = {}) {
    index = Math.max(0, Math.min(LAST, index));
    const prev = current;
    current = index;
    const meta = SCENES[index];
    const targetGroup = groupFor[meta.group];

    sceneEls.forEach((el) => el.classList.toggle('active', el === targetGroup));
    stageSvg.dataset.stage = String(index);
    stageSvg.dataset.scene = String(index);
    document.body.dataset.scene = String(index);
    seen.add(index);

    // story panel
    storyPanels.forEach((panel, i) => {
      const active = i === index;
      panel.classList.toggle('active', active);
      panel.setAttribute('aria-hidden', String(!active));
    });

    // stage chrome
    figNo.textContent = meta.fig;
    figTitle.textContent = meta.title;
    stageStatus.dataset.tone = meta.tone;
    statusText.textContent = meta.status;
    tCount.textContent = `${String(index + 1).padStart(2, '0')} / 07`;
    tChapter.textContent = meta.chapter;
    stageSceneNum.textContent = String(index + 1).padStart(2, '0');
    stageFormula.textContent = meta.formula;

    // the central sample card gains a harness-specific label
    if (baseRealMain) {
      baseRealMain.textContent = index === 2 ? '被夹住后，仍可交付' : '这一条，被真实采出';
    }

    // tabs
    dotButtons().forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('active', active);
      dot.classList.toggle('visited', seen.has(i) && !active);
      if (active) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === LAST;

    if (prev !== index) {
      sceneStarted = performance.now();
      progress = 0;
      if (autoFill) autoFill.style.width = '0%';
    }

    if (opts.user) {
      setPlaying(false);
    }
    refreshPlayButton();
  }

  function manualGo(index) {
    if (index === current) {
      setPlaying(false);
      return;
    }
    setPlaying(false);
    activate(index, { user: true });
  }

  function nextScene() {
    if (current < LAST) manualGo(current + 1);
  }

  function prevScene() {
    if (current > 0) manualGo(current - 1);
  }

  /* ---------------- playback ---------------- */
  function setPlaying(next) {
    if (next && current === LAST) {
      current = -1; // force activation of the first scene below
      playing = true;
      bodyPlaying(true);
      activate(0, { user: false });
      sceneStarted = performance.now();
      progress = 0;
      refreshPlayButton();
      return;
    }
    playing = Boolean(next);
    if (playing) {
      sceneStarted = performance.now();
      progress = 0;
      if (autoFill) autoFill.style.width = '0%';
    }
    bodyPlaying(playing);
    refreshPlayButton();
  }

  function bodyPlaying(on) {
    document.body.classList.toggle('is-playing', Boolean(on));
  }

  function refreshPlayButton() {
    if (!playBtn) return;
    playBtn.setAttribute('aria-pressed', String(playing));
    if (playing) {
      playLabel.textContent = '自动演示中';
      playBtn.setAttribute('aria-label', '暂停自动演示');
      playBtn.title = '暂停自动演示（Space）';
    } else if (current === LAST) {
      playLabel.textContent = '重新播放';
      playBtn.setAttribute('aria-label', '重新播放演示');
      playBtn.title = '重新播放（Space）';
    } else {
      playLabel.textContent = '自动演示';
      playBtn.setAttribute('aria-label', '开始自动演示');
      playBtn.title = '开始自动演示（Space）';
    }
    bodyPlaying(playing);
  }

  function tick(now) {
    if (playing) {
      const dur = DURATIONS[current] || 13000;
      const elapsed = now - sceneStarted;
      progress = Math.min(1, Math.max(0, elapsed / dur));
      if (autoFill) autoFill.style.width = `${(progress * 100).toFixed(2)}%`;
      if (progress >= 1) {
        if (current < LAST) {
          activate(current + 1, { fromAuto: true });
        } else {
          setPlaying(false);
        }
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- toast ---------------- */
  function showToast(message) {
    if (!toastEl) return;
    window.clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add('show');
    toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2100);
  }

  /* ---------------- notes / fullscreen ---------------- */
  let returnFocus = null;
  function openNotes() {
    if (!notesDialog) return;
    returnFocus = document.activeElement;
    if (typeof notesDialog.showModal === 'function') {
      if (!notesDialog.open) notesDialog.showModal();
    } else {
      notesDialog.setAttribute('open', '');
    }
    document.body.classList.add('dialog-open');
    window.setTimeout(() => closeNotes && closeNotes.focus(), 80);
  }

  function closeNotesDialog() {
    if (!notesDialog) return;
    if (typeof notesDialog.close === 'function' && notesDialog.open) notesDialog.close();
    else notesDialog.removeAttribute('open');
    document.body.classList.remove('dialog-open');
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
  }

  function toggleFullscreen() {
    const root = document.documentElement;
    if (!document.fullscreenElement && root.requestFullscreen) {
      root.requestFullscreen().catch(() => showToast('当前浏览器不允许全屏'));
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    } else {
      showToast('当前浏览器不支持全屏');
    }
  }

  /* ---------------- boot ---------------- */
  buildBaseFan();
  addRealMotionDot();
  buildCloud();
  buildTurnGhosts();
  buildLearnFan();
  buildFinalGhosts();
  buildDots();

  const params = new URLSearchParams(window.location.search);
  let initial = 0;
  if (params.has('scene')) {
    const value = Number(params.get('scene'));
    if (Number.isFinite(value)) initial = value > 0 ? value - 1 : 0;
  }
  initial = Math.max(0, Math.min(LAST, initial));

  const autoRequested = params.get('auto') !== '0';
  const shouldAuto = autoRequested && !reduceMotion && initial !== LAST;

  // activate the first view without pausing / announcing
  activate(initial, { user: false });
  if (shouldAuto) {
    playing = true;
    sceneStarted = performance.now();
    bodyPlaying(true);
    refreshPlayButton();
  } else {
    playing = false;
    bodyPlaying(false);
    refreshPlayButton();
  }

  if (reduceMotion && typeof stageSvg.pauseAnimations === 'function') {
    stageSvg.pauseAnimations();
  }

  requestAnimationFrame(tick);

  prevBtn.addEventListener('click', prevScene);
  nextBtn.addEventListener('click', nextScene);
  playBtn.addEventListener('click', () => setPlaying(!playing));
  notesBtn.addEventListener('click', openNotes);
  closeNotes.addEventListener('click', closeNotesDialog);
  fullBtn.addEventListener('click', toggleFullscreen);

  notesDialog.addEventListener('click', (event) => {
    if (event.target === notesDialog) closeNotesDialog();
  });
  notesDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeNotesDialog();
  });

  const sourceImg = notesDialog.querySelector('.source-image-wrap img');
  if (sourceImg) {
    sourceImg.addEventListener('error', () => {
      const figure = sourceImg.closest('.source-figure');
      if (figure) figure.hidden = true;
      showToast('原始草图 origin.jpg 不在当前目录');
    });
  }

  document.addEventListener('fullscreenchange', () => {
    const icon = fullBtn.querySelector('svg');
    if (icon) {
      icon.style.opacity = document.fullscreenElement ? '0.55' : '1';
    }
  });

  document.addEventListener('keydown', (event) => {
    const tag = (event.target && event.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || event.metaKey || event.ctrlKey || event.altKey) return;
    if (notesDialog.open) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      nextScene();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      prevScene();
    } else if (event.code === 'Space') {
      event.preventDefault();
      setPlaying(!playing);
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleFullscreen();
    } else if (event.key.toLowerCase() === 'n') {
      event.preventDefault();
      openNotes();
    } else if (/^[1-7]$/.test(event.key)) {
      event.preventDefault();
      manualGo(Number(event.key) - 1);
    } else if (event.key === 'Escape' && document.fullscreenElement) {
      // fullscreen API handles Escape; nothing to intercept here
    }
  });

  // swipe left / right on the diagram
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    swipeStart = { x: event.clientX, y: event.clientY, time: performance.now() };
  });
  stage.addEventListener('pointerup', (event) => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    const dt = performance.now() - swipeStart.time;
    swipeStart = null;
    if (dt < 650 && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) nextScene();
      else prevScene();
    }
  });
  stage.addEventListener('pointercancel', () => { swipeStart = null; });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) {
      setPlaying(false);
    }
  });

  // expose a tiny hook for presentation automation / screenshots
  window.harnessDemo = {
    go: (index) => manualGo(Math.max(0, Math.min(LAST, Number(index) - 1))),
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    scene: () => current + 1,
    next: nextScene,
    prev: prevScene
  };
})();
