/**
 * STYLE IN FICTION · CHAPTER 2: STYLE, TEXT, AND FREQUENCY
 * 3D Cinematic Investigation Experience (Black + Navy + Silver Edition)
 * Supervising Lecturer: Dr. Mamdouh Fouad Hassan | Sohag University
 */

(function () {
  'use strict';

  // ==========================================
  // 1. CONSTANTS & STATE
  // ==========================================
  const TOTAL_SLIDES = 10;
  const SLIDE_TRANSITION_DURATION = 0.92;
  let currentSlideIndex = 0;
  let isSlideTransitioning = false;
  let isSpatialMode = false;
  let isSoundEnabled = false;
  let audioCtx = null;
  let tickingInterval = null;

  // DOM Elements
  const slides = Array.from(document.querySelectorAll('.slide'));
  const btnPrevCase = document.getElementById('btn-prev-case');
  const btnNextCase = document.getElementById('btn-next-case');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const caseCounter = document.getElementById('case-counter');
  const slidePillsContainer = document.getElementById('slide-pills-container');
  const caseIndexDrawer = document.getElementById('case-index-drawer');
  const btnEvidenceDrawer = document.getElementById('btn-evidence-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawerCasesList = document.getElementById('drawer-cases-list');
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const audioIconOff = document.getElementById('audio-icon-off');
  const audioIconOn = document.getElementById('audio-icon-on');
  const audioStatusLabel = document.getElementById('audio-status-label');
  const btnFullscreenToggle = document.getElementById('btn-fullscreen-toggle');
  const btnSpatialMode = document.getElementById('btn-spatial-mode');
  const spatialHud = document.getElementById('spatial-hud');
  const btnExitSpatial = document.getElementById('btn-exit-spatial');
  const presentationViewport = document.getElementById('presentation-viewport');

  // Intro Elements
  const cinematicIntro = document.getElementById('cinematic-intro');
  const introPrompt = document.getElementById('intro-prompt');
  const btnIgniteIntro = document.getElementById('btn-ignite-intro');
  const introDossier = document.getElementById('intro-dossier');
  const classifiedStamp = document.getElementById('classified-stamp');
  const btnEnterInvestigation = document.getElementById('btn-enter-investigation');

  // Quiz Overlays
  const festivalOverlay = document.getElementById('festival-overlay');
  const festivalCanvas = document.getElementById('festival-canvas');
  const disappointedModal = document.getElementById('disappointed-modal');
  const btnDismissDisappointed = document.getElementById('btn-dismiss-disappointed');
  const disappointedText = document.getElementById('disappointed-text');

  // Slide 9 Actions
  const btnView3DRoom = document.getElementById('btn-view-3d-room');
  const btnRestartInvestigation = document.getElementById('btn-restart-investigation');

  // Mouse Normal for Parallax
  let mouseNorm = { x: 0, y: 0 };

  // ==========================================
  // 2. PROCEDURAL WEB AUDIO SYNTHESIZER
  // 100% Offline, Zero External Audio Files
  // ==========================================
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playTick() {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.025);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
  }

  function playClick() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  function playStampSlam() {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, audioCtx.currentTime + 0.24);
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.29);
    } catch (e) {}
  }

  function playFanfare() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const notes = [
        { f: 523.25, d: 0.12, t: 0 },    // C5
        { f: 659.25, d: 0.12, t: 0.1 },  // E5
        { f: 783.99, d: 0.15, t: 0.2 },  // G5
        { f: 1046.50, d: 0.45, t: 0.32 } // C6
      ];
      notes.forEach((n) => {
        setTimeout(() => playTone(n.f, n.d, 'triangle', 0.25), n.t * 1000);
      });
    } catch (e) {}
  }

  function playSadTrombone() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const notes = [
        { f: 293.66, d: 0.22, t: 0 },    // D4
        { f: 277.18, d: 0.22, t: 0.24 }, // C#4
        { f: 261.63, d: 0.24, t: 0.48 }, // C4
        { f: 233.08, d: 0.65, t: 0.74 }  // Bb3
      ];
      notes.forEach((n) => {
        setTimeout(() => playTone(n.f, n.d, 'sawtooth', 0.2), n.t * 1000);
      });
    } catch (e) {}
  }

  function toggleAudio() {
    initAudio();
    isSoundEnabled = !isSoundEnabled;
    if (isSoundEnabled) {
      audioIconOff.classList.add('hidden');
      audioIconOn.classList.remove('hidden');
      audioStatusLabel.textContent = 'AUDIO: ON';
      btnAudioToggle.classList.add('active');
      playTone(440, 0.15, 'sine', 0.2);
    } else {
      audioIconOff.classList.remove('hidden');
      audioIconOn.classList.add('hidden');
      audioStatusLabel.textContent = 'AUDIO: OFF';
      btnAudioToggle.classList.remove('active');
    }
  }

  // ==========================================
  // 3. THREE.JS 3D INVESTIGATION ROOM (BLACK + NAVY + SILVER)
  // ==========================================
  let scene, camera, renderer, particlesMesh;
  let deskMesh, lampMesh, deskLight, navySpotlight;
  let folderGroup, folderCoverTop;
  const pinNodes = [];
  let cyanStringLines;

  let targetCamPos = { x: 0, y: 1.5, z: 22 };
  let targetCamLookAt = { x: 0, y: 0, z: 0 };
  let currentCamLookAt = { x: 0, y: 0, z: 0 };
  let isDraggingSpatial = false;
  let prevMousePos = { x: 0, y: 0 };
  let spatialOrbitAngle = { phi: 0, theta: 0 };

  // 9 Stage coordinates in 3D investigation space
  const nodePositions3D = [];
  for (let i = 0; i < TOTAL_SLIDES; i++) {
    const angle = (i / TOTAL_SLIDES) * Math.PI * 2 - Math.PI * 0.5;
    const radius = 13;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * (radius * 0.55);
    const z = (i - TOTAL_SLIDES / 2) * 2;
    nodePositions3D.push({ x, y, z });
  }

  function init3DScene() {
    const container = document.getElementById('webgl-container');
    if (!window.THREE || !container) {
      console.warn('Three.js not loaded, using fallback.');
      return;
    }

    // 1. Scene & Volumetric Black/Navy Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07080b, 0.022);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 28); // Starts high in darkness

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 4. Lights: Black + Navy + Silver Illumination
    const ambientLight = new THREE.AmbientLight(0x0a192f, 0.45);
    scene.add(ambientLight);

    // Deep Midnight Sapphire Navy Spotlight
    navySpotlight = new THREE.SpotLight(0x1e3a8a, 0, 50, Math.PI / 3.8, 0.4);
    navySpotlight.position.set(0, 16, 12);
    scene.add(navySpotlight);

    // Platinum Silver Desk Spotlight
    deskLight = new THREE.SpotLight(0xe2e8f0, 0, 55, Math.PI / 3.5, 0.35, 1);
    deskLight.position.set(-6, 14, 8);
    scene.add(deskLight);

    // Ice Cyan Rim Light
    const cyanRimLight = new THREE.PointLight(0x38bdf8, 0.7, 60);
    cyanRimLight.position.set(16, -10, 14);
    scene.add(cyanRimLight);

    // 5. 3D Investigation Desk (Midnight Black/Navy)
    const deskGeo = new THREE.BoxGeometry(26, 1.2, 16);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0b0e14,
      roughness: 0.65,
      metalness: 0.3
    });
    deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.set(0, -5, 0);
    scene.add(deskMesh);

    // 6. 3D Folder with Unfolding Flap on Desk
    folderGroup = new THREE.Group();
    folderGroup.position.set(0, -4.3, 3);
    folderGroup.rotation.x = -Math.PI * 0.12;

    const baseFolderGeo = new THREE.BoxGeometry(6.5, 0.1, 4.8);
    const folderMat = new THREE.MeshStandardMaterial({ color: 0x0a192f, roughness: 0.5, metalness: 0.3 });
    const folderBase = new THREE.Mesh(baseFolderGeo, folderMat);
    folderGroup.add(folderBase);

    // Flap with hinge
    const flapGeo = new THREE.BoxGeometry(6.5, 0.08, 4.8);
    flapGeo.translate(0, 0, 2.4);
    const flapMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4, metalness: 0.4 });
    folderCoverTop = new THREE.Mesh(flapGeo, flapMat);
    folderCoverTop.position.set(0, 0.06, -2.4);
    folderGroup.add(folderCoverTop);

    scene.add(folderGroup);

    // 7. Atmospheric Floating Silver & Cyan Particles
    const particleCount = 850;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      particlePos[p] = (Math.random() - 0.5) * 55;
      particlePos[p + 1] = (Math.random() - 0.5) * 38;
      particlePos[p + 2] = (Math.random() - 0.5) * 45;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.14,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    particlesMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particlesMesh);

    // 8. 9 Pinned Case Nodes (Silver and Cyan Spheres)
    const pinHeadGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const pinShaftGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8);

    for (let i = 0; i < TOTAL_SLIDES; i++) {
      const pinGroup = new THREE.Group();
      const pos = nodePositions3D[i];
      pinGroup.position.set(pos.x, pos.y, pos.z);

      const isCurrent = i === 0;
      const headMat = new THREE.MeshStandardMaterial({
        color: isCurrent ? 0x38bdf8 : (i % 2 === 0 ? 0xe2e8f0 : 0x1e3a8a),
        metalness: 0.8,
        roughness: 0.2,
        emissive: isCurrent ? 0x38bdf8 : 0x000000,
        emissiveIntensity: isCurrent ? 0.75 : 0
      });
      const shaftMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

      const headMesh = new THREE.Mesh(pinHeadGeo, headMat);
      headMesh.position.y = 0.35;
      const shaftMesh = new THREE.Mesh(pinShaftGeo, shaftMat);

      pinGroup.add(shaftMesh);
      pinGroup.add(headMesh);
      pinGroup.userData = { slideIndex: i, title: slides[i]?.dataset.title || `Case ${i + 1}` };

      scene.add(pinGroup);
      pinNodes.push(pinGroup);
    }

    // 9. Glowing Cyan & Silver Strings connecting evidence cases
    const stringPoints = [];
    for (let i = 0; i < TOTAL_SLIDES - 1; i++) {
      stringPoints.push(new THREE.Vector3(nodePositions3D[i].x, nodePositions3D[i].y, nodePositions3D[i].z));
      stringPoints.push(new THREE.Vector3(nodePositions3D[i + 1].x, nodePositions3D[i + 1].y, nodePositions3D[i + 1].z));
    }
    // Cross loop
    stringPoints.push(new THREE.Vector3(nodePositions3D[1].x, nodePositions3D[1].y, nodePositions3D[1].z));
    stringPoints.push(new THREE.Vector3(nodePositions3D[6].x, nodePositions3D[6].y, nodePositions3D[6].z));
    stringPoints.push(new THREE.Vector3(nodePositions3D[2].x, nodePositions3D[2].y, nodePositions3D[2].z));
    stringPoints.push(new THREE.Vector3(nodePositions3D[5].x, nodePositions3D[5].y, nodePositions3D[5].z));

    const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
    const stringMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      linewidth: 1.5
    });
    cyanStringLines = new THREE.LineSegments(stringGeo, stringMat);
    scene.add(cyanStringLines);

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    setupSpatialInteractions(container);
    animate3D();
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeFestivalCanvas();
  }

  function updateCameraForSlide(index) {
    if (!camera) return;
    const targetNode = nodePositions3D[index];
    if (isSpatialMode) {
      targetCamPos = { x: 0, y: 1.5, z: 28 };
      targetCamLookAt = { x: 0, y: 0, z: 0 };
    } else {
      targetCamPos = {
        x: targetNode.x * 0.45,
        y: targetNode.y * 0.45,
        z: targetNode.z + 18
      };
      targetCamLookAt = {
        x: targetNode.x * 0.35,
        y: targetNode.y * 0.35,
        z: targetNode.z
      };
    }

    // Highlight active pin node
    pinNodes.forEach((node, i) => {
      const head = node.children[1];
      if (head && head.material) {
        if (i === index) {
          head.material.color.setHex(0x38bdf8);
          head.material.emissive.setHex(0x38bdf8);
          head.material.emissiveIntensity = 0.85;
          node.scale.set(1.4, 1.4, 1.4);
        } else {
          head.material.color.setHex(i % 2 === 0 ? 0xe2e8f0 : 0x1e3a8a);
          head.material.emissive.setHex(0x000000);
          head.material.emissiveIntensity = 0;
          node.scale.set(1, 1, 1);
        }
      }
    });
  }

  function setupSpatialInteractions(container) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    container.addEventListener('mousedown', (e) => {
      if (!isSpatialMode) return;
      isDraggingSpatial = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      mouseNorm.x = (e.clientX / window.innerWidth) - 0.5;
      mouseNorm.y = (e.clientY / window.innerHeight) - 0.5;

      if (isSpatialMode && isDraggingSpatial) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        spatialOrbitAngle.theta += deltaX * 0.005;
        spatialOrbitAngle.phi = Math.max(-Math.PI * 0.35, Math.min(Math.PI * 0.35, spatialOrbitAngle.phi + deltaY * 0.005));

        const radius = 28;
        targetCamPos.x = radius * Math.sin(spatialOrbitAngle.theta) * Math.cos(spatialOrbitAngle.phi);
        targetCamPos.y = radius * Math.sin(spatialOrbitAngle.phi);
        targetCamPos.z = radius * Math.cos(spatialOrbitAngle.theta) * Math.cos(spatialOrbitAngle.phi);

        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => { isDraggingSpatial = false; });

    container.addEventListener('click', (e) => {
      if (!isSpatialMode) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(pinNodes, true);
      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && root.parent !== scene) root = root.parent;
        if (root.userData && typeof root.userData.slideIndex === 'number') {
          playClick();
          goToSlide(root.userData.slideIndex);
          toggleSpatialMode(false);
        }
      }
    });
  }

  function toggleSpatialMode(forceState) {
    isSpatialMode = typeof forceState === 'boolean' ? forceState : !isSpatialMode;
    const container = document.getElementById('webgl-container');

    if (isSpatialMode) {
      spatialHud.classList.remove('hidden');
      btnSpatialMode.classList.add('active');
      presentationViewport.style.opacity = '0.08';
      presentationViewport.style.pointerEvents = 'none';
      container.classList.add('interactive-spatial');
      playTone(550, 0.15, 'sine', 0.2);
    } else {
      spatialHud.classList.add('hidden');
      btnSpatialMode.classList.remove('active');
      presentationViewport.style.opacity = '1';
      presentationViewport.style.pointerEvents = 'auto';
      container.classList.remove('interactive-spatial');
      playTone(380, 0.15, 'sine', 0.15);
    }
    updateCameraForSlide(currentSlideIndex);
  }

  function animate3D() {
    requestAnimationFrame(animate3D);

    if (particlesMesh) {
      particlesMesh.rotation.y += 0.0006;
      particlesMesh.rotation.x += 0.0003;
    }

    if (camera) {
      const pX = targetCamPos.x + (mouseNorm.x * 1.5);
      const pY = targetCamPos.y - (mouseNorm.y * 1.2);

      camera.position.x += (pX - camera.position.x) * 0.055;
      camera.position.y += (pY - camera.position.y) * 0.055;
      camera.position.z += (targetCamPos.z - camera.position.z) * 0.055;

      currentCamLookAt.x += (targetCamLookAt.x - currentCamLookAt.x) * 0.055;
      currentCamLookAt.y += (targetCamLookAt.y - currentCamLookAt.y) * 0.055;
      currentCamLookAt.z += (targetCamLookAt.z - currentCamLookAt.z) * 0.055;

      camera.lookAt(currentCamLookAt.x, currentCamLookAt.y, currentCamLookAt.z);
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // ==========================================
  // 4. EXTRAORDINARY CINEMATIC OPENING
  // ==========================================
  function setupCinematicIntro() {
    tickingInterval = setInterval(() => {
      if (cinematicIntro && !cinematicIntro.classList.contains('dismissed')) {
        playTick();
      }
    }, 1000);

    btnIgniteIntro.addEventListener('click', () => {
      initAudio();
      clearInterval(tickingInterval);

      if (window.gsap) {
        gsap.to(introPrompt, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          onComplete: () => {
            introPrompt.classList.add('hidden');
            triggerRoomIllumination();
          }
        });
      } else {
        introPrompt.classList.add('hidden');
        triggerRoomIllumination();
      }
    });

    btnEnterInvestigation.addEventListener('click', () => {
      playClick();
      cinematicIntro.classList.add('dismissed');

      if (window.gsap && camera) {
        gsap.to(camera.position, {
          x: nodePositions3D[0].x * 0.45,
          y: nodePositions3D[0].y * 0.45,
          z: nodePositions3D[0].z + 18,
          duration: 1.8,
          ease: 'power3.inOut',
          onComplete: () => {
            goToSlide(0);
          }
        });
      } else {
        goToSlide(0);
      }
    });
  }

  function triggerRoomIllumination() {
    if (window.gsap && navySpotlight && deskLight) {
      gsap.to(navySpotlight, { intensity: 4.8, duration: 2.2, ease: 'power2.in' });
      gsap.to(deskLight, { intensity: 3.5, delay: 0.8, duration: 1.8, ease: 'power2.out' });

      gsap.to(camera.position, {
        x: 0,
        y: 0.5,
        z: 14,
        duration: 2.8,
        ease: 'power3.out'
      });

      if (folderCoverTop) {
        gsap.to(folderCoverTop.rotation, {
          x: Math.PI * 0.85,
          delay: 1.2,
          duration: 1.5,
          ease: 'power2.inOut'
        });
      }
    }

    setTimeout(() => {
      introDossier.classList.remove('hidden');

      setTimeout(() => {
        classifiedStamp.classList.add('stamp-slam');
        playStampSlam();
      }, 500);
    }, 1500);
  }

  // ==========================================
  // 5. FESTIVAL CELEBRATION (SILVER + NAVY + CYAN)
  // ==========================================
  let festivalParticles = [];
  let festivalAnimId = null;

  function resizeFestivalCanvas() {
    if (!festivalCanvas) return;
    festivalCanvas.width = window.innerWidth;
    festivalCanvas.height = window.innerHeight;
  }

  function launchFestivalCelebration() {
    playFanfare();
    festivalOverlay.classList.remove('hidden');

    resizeFestivalCanvas();
    const ctx = festivalCanvas.getContext('2d');
    const colors = ['#E2E8F0', '#38BDF8', '#60A5FA', '#1E3A8A', '#FFFFFF', '#94A3B8'];

    festivalParticles = [];
    for (let i = 0; i < 400; i++) {
      festivalParticles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 220,
        y: window.innerHeight * 0.55 + (Math.random() - 0.5) * 90,
        vx: (Math.random() - 0.5) * 26,
        vy: -Math.random() * 24 - 6,
        size: Math.random() * 11 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.22,
        shape: Math.random() > 0.5 ? 'ribbon' : 'star',
        opacity: 1
      });
    }

    if (festivalAnimId) cancelAnimationFrame(festivalAnimId);
    animateFestivalParticles(ctx);

    setTimeout(() => {
      festivalOverlay.classList.add('hidden');
    }, 3200);
  }

  function animateFestivalParticles(ctx) {
    ctx.clearRect(0, 0, festivalCanvas.width, festivalCanvas.height);
    let alive = 0;

    festivalParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.48;
      p.vx *= 0.98;
      p.rotation += p.vRot;
      p.opacity -= 0.0055;

      if (p.opacity > 0 && p.y < festivalCanvas.height + 60) {
        alive++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'ribbon') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (alive > 0) {
      festivalAnimId = requestAnimationFrame(() => animateFestivalParticles(ctx));
    } else {
      ctx.clearRect(0, 0, festivalCanvas.width, festivalCanvas.height);
    }
  }

  // ==========================================
  // 6. DISAPPOINTED FACE MODAL
  // ==========================================
  const critiqueQuotes = [
    "“The stylistician sighs in deep disappointment... Frequency distributions must be measured, not assumed!”",
    "“Halliday shakes his head in sorrow... Prominence is both departure and attainment of a norm!”",
    "“The Prague School linguists are frowning... Foregrounding demands motivated aesthetic purpose!”",
    "“Dr. Mamdouh Fouad Hassan urges you to review the benchmark table!”",
    "“An unexpected deviance... but alas, completely in the wrong direction! 🥺”"
  ];

  function showDisappointedModal() {
    playSadTrombone();
    const q = critiqueQuotes[Math.floor(Math.random() * critiqueQuotes.length)];
    disappointedText.textContent = q;
    disappointedModal.classList.remove('hidden');
  }

  function hideDisappointedModal() {
    disappointedModal.classList.add('hidden');
  }

  // ==========================================
  // 7. NAVIGATION ENGINE
  // ==========================================
  function initNavigation() {
    // Slide pills
    slidePillsContainer.innerHTML = '';
    for (let i = 0; i < TOTAL_SLIDES; i++) {
      const pill = document.createElement('div');
      pill.className = `slide-pill ${i === 0 ? 'active' : ''}`;
      pill.title = `Section ${i + 1}: ${slides[i]?.dataset.title || ''}`;
      pill.addEventListener('click', () => {
        playClick();
        goToSlide(i);
      });
      slidePillsContainer.appendChild(pill);
    }

    // Drawer list
    drawerCasesList.innerHTML = '';
    slides.forEach((slide, idx) => {
      const item = document.createElement('div');
      item.className = `drawer-item ${idx === 0 ? 'active' : ''}`;
      item.innerHTML = `
        <span class="drawer-case-num">SEC ${String(idx + 1).padStart(2, '0')}</span>
        <span class="drawer-case-title">${slide.dataset.title || 'Untitled Section'}</span>
      `;
      item.addEventListener('click', () => {
        playClick();
        goToSlide(idx);
        closeDrawer();
      });
      drawerCasesList.appendChild(item);
    });

    // Deck Buttons
    btnPrevCase.addEventListener('click', () => {
      playClick();
      prevSlide();
    });

    btnNextCase.addEventListener('click', () => {
      playClick();
      window.nextSlide();
    });

    if (btnView3DRoom) {
      btnView3DRoom.addEventListener('click', () => toggleSpatialMode(true));
    }

    if (btnRestartInvestigation) {
      btnRestartInvestigation.addEventListener('click', () => {
        playStampSlam();
        goToSlide(0);
      });
    }

    // Drawer controls
    btnEvidenceDrawer.addEventListener('click', () => {
      playClick();
      toggleDrawer();
    });
    btnCloseDrawer.addEventListener('click', () => {
      playClick();
      closeDrawer();
    });

    // 3D Spatial Room mode controls
    btnSpatialMode.addEventListener('click', () => toggleSpatialMode());
    btnExitSpatial.addEventListener('click', () => toggleSpatialMode(false));

    // Audio & Fullscreen
    btnAudioToggle.addEventListener('click', toggleAudio);
    btnFullscreenToggle.addEventListener('click', toggleFullscreen);

    // Disappointed Modal dismiss
    btnDismissDisappointed.addEventListener('click', () => {
      playClick();
      hideDisappointedModal();
    });

    if (disappointedModal) {
      disappointedModal.addEventListener('click', (e) => {
        if (e.target === disappointedModal) {
          playClick();
          hideDisappointedModal();
        }
      });
    }

    if (festivalOverlay) {
      festivalOverlay.addEventListener('click', () => {
        festivalOverlay.classList.add('hidden');
      });
    }

    // Keyboard events
    window.addEventListener('keydown', handleKeyboard);

    // 3D Mouse Parallax Tilt
    setup3DCardParallax();
  }

  function goToSlide(index) {
    if (isSlideTransitioning || index < 0 || index >= TOTAL_SLIDES || index === currentSlideIndex) return;

    const outgoingSlide = slides[currentSlideIndex];
    const incomingSlide = slides[index];
    const direction = index > currentSlideIndex ? 1 : -1;
    isSlideTransitioning = true;
    currentSlideIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev-slide', 'transitioning', 'transition-out');
      if (i < currentSlideIndex) slide.classList.add('prev-slide');
    });
    outgoingSlide.classList.add('transitioning', 'transition-out');
    incomingSlide.classList.add('active', 'transitioning');
    outgoingSlide.style.zIndex = '1';
    incomingSlide.style.zIndex = '2';
    const incomingCard = incomingSlide.querySelector('.dossier-card');
    if (incomingCard) {
      incomingCard.scrollTop = 0;
      incomingCard.style.transform = '';
    }

    // Update Counter & Progress
    caseCounter.textContent = `SECTION ${String(currentSlideIndex + 1).padStart(2, '0')} / ${String(TOTAL_SLIDES).padStart(2, '0')}`;
    const progressPct = ((currentSlideIndex + 1) / TOTAL_SLIDES) * 100;
    progressBarFill.style.width = `${progressPct}%`;

    // Update Nav Buttons
    btnPrevCase.disabled = currentSlideIndex === 0;
    if (currentSlideIndex === TOTAL_SLIDES - 1) {
      btnNextCase.innerHTML = '<span>CONCLUDED</span>';
    } else {
      btnNextCase.innerHTML = '<span>NEXT</span><span class="nav-arrow">→</span>';
    }

    // Update Pills
    const pills = slidePillsContainer.querySelectorAll('.slide-pill');
    pills.forEach((p, idx) => p.classList.toggle('active', idx === currentSlideIndex));

    // Update Drawer
    const drawerItems = drawerCasesList.querySelectorAll('.drawer-item');
    drawerItems.forEach((item, idx) => item.classList.toggle('active', idx === currentSlideIndex));

    // Update 3D Camera with GSAP
    updateCameraForSlide(currentSlideIndex);

    animateSlideTransition(outgoingSlide, incomingSlide, direction);

    // Slide-specific actions
    triggerSlideAction(currentSlideIndex);
  }

  function getSlideRevealTargets(slide) {
    const selector = [
      '.dossier-card > *',
      '.dossier-content-center > *',
      '.dossier-title',
      '.dossier-subtitle',
      '.triad-stage-card',
      '.stage-flow-arrow',
      '.forensic-norms-table tbody tr',
      '.norm-anno-card',
      '.stylistic-tool-box',
      '.perspective-card',
      '.takeaway-synthesis-card',
      '.synth-card',
      '.academic-signoff-grid > *',
      '.closing-cta-row > *',
      '.q-opt-button',
      '.quiz-explanation-banner',
      '.quiz-complete-screen > *'
    ].join(', ');

    const candidates = Array.from(new Set(slide.querySelectorAll(selector)))
      .filter((element) => element.getClientRects().length > 0);

    // Animate the most specific matching elements to avoid double-transforming
    // a container and its children at the same time.
    return candidates.filter((element) =>
      !candidates.some((candidate) => candidate !== element && element.contains(candidate))
    );
  }

  function animateSlideTransition(outgoingSlide, incomingSlide, direction) {
    const reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = getSlideRevealTargets(incomingSlide);
    const fallbackAnimations = [];
    let transitionFinished = false;
    const finish = () => {
      if (transitionFinished) return;
      transitionFinished = true;
      outgoingSlide.classList.remove('transitioning', 'transition-out');
      incomingSlide.classList.remove('transitioning');
      outgoingSlide.style.removeProperty('z-index');
      incomingSlide.style.removeProperty('z-index');
      fallbackAnimations.forEach((animation) => animation.cancel());
      if (window.gsap) {
        gsap.set([outgoingSlide, incomingSlide], { clearProps: 'transform,opacity,filter' });
        if (outgoingSlide.querySelector('.dossier-card')) {
          gsap.set(outgoingSlide.querySelector('.dossier-card'), { clearProps: 'transform,opacity,filter' });
        }
        if (revealTargets.length) {
          gsap.set(revealTargets, { clearProps: 'transform,opacity,filter' });
        }
      }
      isSlideTransitioning = false;
    };

    if (reduceMotion) {
      finish();
      return;
    }

    if (window.gsap) {
      const timeline = gsap.timeline({ onComplete: finish });
      timeline.fromTo(outgoingSlide,
        { x: 0, z: 0, rotationY: 0, scale: 1, opacity: 1, filter: 'blur(0px)' },
        {
          x: direction * -72,
          z: -64,
          rotationY: direction * -3.5,
          scale: 0.985,
          opacity: 0,
          filter: 'blur(5px)',
          duration: 0.68,
          ease: 'power2.in'
        }, 0);
      timeline.fromTo(incomingSlide,
        {
          x: direction * 92,
          z: -90,
          rotationY: direction * 4.5,
          scale: 0.96,
          opacity: 0,
          filter: 'blur(7px)'
        },
        {
          x: 0,
          z: 0,
          rotationY: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.86,
          ease: 'power3.out'
        }, 0);

      const staggerAmount = Math.min(0.34, revealTargets.length * 0.028);
      if (revealTargets.length) {
        timeline.fromTo(revealTargets,
          { y: 16, scale: 0.985, opacity: 0, filter: 'blur(3px)' },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.48,
            stagger: { amount: staggerAmount },
            ease: 'power2.out',
            clearProps: 'transform,filter,opacity'
          }, 0.2);
      }
      if (isSoundEnabled) playTick();
      return;
    }

    const duration = SLIDE_TRANSITION_DURATION * 1000;
    if (typeof outgoingSlide.animate === 'function' && typeof incomingSlide.animate === 'function') {
      const outgoingAnimation = outgoingSlide.animate([
        { transform: 'translate3d(0, 0, 0) rotateY(0deg) scale(1)', opacity: 1, filter: 'blur(0px)' },
        {
          transform: `translate3d(${-direction * 72}px, 0, -64px) rotateY(${-direction * 3.5}deg) scale(.985)`,
          opacity: 0,
          filter: 'blur(5px)'
        }
      ], { duration: duration * 0.75, easing: 'cubic-bezier(.55, 0, .8, .4)', fill: 'both' });
      const incomingAnimation = incomingSlide.animate([
        {
          transform: `translate3d(${direction * 92}px, 0, -90px) rotateY(${direction * 4.5}deg) scale(.96)`,
          opacity: 0,
          filter: 'blur(7px)'
        },
        { transform: 'translate3d(0, 0, 0) rotateY(0deg) scale(1)', opacity: 1, filter: 'blur(0px)' }
      ], { duration, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' });
      fallbackAnimations.push(outgoingAnimation, incomingAnimation);

      const childAnimations = revealTargets.map((element, index) =>
        element.animate([
          { transform: 'translateY(16px) scale(.985)', opacity: 0, filter: 'blur(3px)' },
          { transform: 'translateY(0) scale(1)', opacity: 1, filter: 'blur(0px)' }
        ], {
          duration: 480,
          delay: 200 + index * 35,
          easing: 'cubic-bezier(.16, 1, .3, 1)',
          fill: 'both'
        })
      );
      fallbackAnimations.push(...childAnimations);
      Promise.all([outgoingAnimation.finished, incomingAnimation.finished, ...childAnimations.map((animation) => animation.finished)])
        .then(finish)
        .catch(finish);
    } else {
      window.setTimeout(finish, duration);
    }
  }

  window.nextSlide = function () {
    if (currentSlideIndex < TOTAL_SLIDES - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  };

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  function handleKeyboard(e) {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        playClick();
        window.nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        playClick();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        playClick();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        playClick();
        goToSlide(TOTAL_SLIDES - 1);
        break;
      case 'b':
      case 'B':
        toggleSpatialMode();
        break;
      case 'c':
      case 'C':
        toggleDrawer();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'm':
      case 'M':
        toggleAudio();
        break;
      case 'Escape':
        if (isSpatialMode) toggleSpatialMode(false);
        if (caseIndexDrawer.classList.contains('open')) closeDrawer();
        if (!disappointedModal.classList.contains('hidden')) hideDisappointedModal();
        break;
    }
  }

  function toggleDrawer() { caseIndexDrawer.classList.toggle('open'); }
  function closeDrawer() { caseIndexDrawer.classList.remove('open'); }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  function setup3DCardParallax() {
    window.addEventListener('mousemove', (e) => {
      if (isSpatialMode) return;
      const activeCard = document.querySelector('.slide.active .dossier-card');
      if (!activeCard) return;

      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;

      const tiltX = -normY * 6;
      const tiltY = normX * 8;
      activeCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.005)`;
    });
  }

  // ==========================================
  // 8. FORENSIC QUIZ ENGINE
  // ==========================================
  const quizQuestions = [
    {
      question: "How does the chapter view style with a readerly focus?",
      options: [
        "A sustained linguistic tendency rather than isolated choices",
        "Random spelling mistakes in a text",
        "Pure mathematical formulas without readers",
        "Only the title of a story"
      ],
      correct: 0,
      rationale: "Style is seen as ongoing recurrence in language rather than single isolated choices."
    },
    {
      question: "What is Deviance in the key triad (Deviance, Prominence, Foregrounding)?",
      options: [
        "A reader's emotional feeling toward a character",
        "A departure from expected frequency norms",
        "A summary at the end of a book",
        "Changing the font size of a page"
      ],
      correct: 1,
      rationale: "Statistical deviance means moving away from usual frequency expectations."
    },
    {
      question: "Which term describes perceptual salience noticed by readers?",
      options: [
        "Prominence",
        "Relative Norm",
        "Internal Variation",
        "Style Markers"
      ],
      correct: 0,
      rationale: "Psychological prominence refers to noticeability or perceptual salience experienced by readers."
    },
    {
      question: "What is a Secondary Norm?",
      options: [
        "Borrowing a style from another genre",
        "A consistent internal text pattern",
        "A departure from a text's own norm",
        "A list of difficult vocabulary words"
      ],
      correct: 1,
      rationale: "A secondary norm is an established, consistent pattern inside the text itself, such as Lok's speech in The Inheritors."
    },
    {
      question: "What is the main takeaway of Chapter 2?",
      options: [
        "Statistics replace literary judgment completely",
        "Frequency reveals pattern; literary insight reveals meaning",
        "Style never changes across scenes",
        "Only local shifts matter in fiction"
      ],
      correct: 1,
      rationale: "Frequency helps spot patterns, while literary insight uncovers meaning."
    }
  ];

  let currentQIndex = 0;
  let quizScore = 0;
  let answeredThisQuestion = false;

  function initQuizEngine() {
    renderQuizQuestion(0);

    const btnProceed = document.getElementById('btn-quiz-proceed');
    if (btnProceed) {
      btnProceed.addEventListener('click', () => {
        playClick();
        if (currentQIndex < quizQuestions.length - 1) {
          currentQIndex++;
          renderQuizQuestion(currentQIndex);
        } else {
          showQuizSummary();
        }
      });
    }

    const btnRetest = document.getElementById('btn-quiz-retest');
    if (btnRetest) {
      btnRetest.addEventListener('click', () => {
        playStampSlam();
        resetQuiz();
      });
    }
  }

  function renderQuizQuestion(qIdx) {
    answeredThisQuestion = false;
    const qData = quizQuestions[qIdx];

    document.getElementById('quiz-q-num').textContent = qIdx + 1;
    document.getElementById('quiz-score-display').textContent = quizScore;

    const interactiveBody = document.getElementById('quiz-interactive-body');
    const explanationBanner = document.getElementById('quiz-explanation-banner');
    const completeScreen = document.getElementById('quiz-complete-screen');

    explanationBanner.classList.add('hidden');
    completeScreen.classList.add('hidden');
    interactiveBody.classList.remove('hidden');

    const letters = ['A', 'B', 'C', 'D'];
    let optionsHtml = '';
    qData.options.forEach((opt, idx) => {
      optionsHtml += `
        <button class="q-opt-button" data-idx="${idx}">
          <span class="opt-prefix">[${letters[idx]}]</span>
          <span>${opt}</span>
        </button>
      `;
    });

    interactiveBody.innerHTML = `
      <h3 class="q-question-text">${qIdx + 1}. ${qData.question}</h3>
      <div class="q-options-stack">${optionsHtml}</div>
    `;

    const buttons = interactiveBody.querySelectorAll('.q-opt-button');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answeredThisQuestion) return;
        const chosen = parseInt(btn.dataset.idx, 10);
        handleAnswer(chosen, buttons);
      });
    });
  }

  function handleAnswer(chosen, allButtons) {
    answeredThisQuestion = true;
    const qData = quizQuestions[currentQIndex];
    const isCorrect = chosen === qData.correct;

    allButtons.forEach((b) => (b.disabled = true));
    allButtons[qData.correct].classList.add('correct');

    const banner = document.getElementById('quiz-explanation-banner');
    const pill = document.getElementById('quiz-status-pill');
    const rationale = document.getElementById('quiz-rationale-text');
    const btnProceed = document.getElementById('btn-quiz-proceed');

    if (isCorrect) {
      quizScore++;
      document.getElementById('quiz-score-display').textContent = quizScore;
      pill.className = 'quiz-status-pill status-correct';
      pill.textContent = '✓ EVIDENCE VERIFIED (CORRECT DEDUCTION)';
      rationale.textContent = qData.rationale;
      launchFestivalCelebration();
    } else {
      allButtons[chosen].classList.add('wrong');
      pill.className = 'quiz-status-pill status-wrong';
      pill.textContent = '✗ FORENSIC CONTRADICTION (INCORRECT DEDUCTION)';
      rationale.textContent = qData.rationale;
      showDisappointedModal();
    }

    if (currentQIndex === quizQuestions.length - 1) {
      btnProceed.textContent = 'VIEW FORENSIC EVALUATION ⟶';
    } else {
      btnProceed.textContent = 'NEXT QUESTION ⟶';
    }

    banner.classList.remove('hidden');
  }

  function showQuizSummary() {
    const interactiveBody = document.getElementById('quiz-interactive-body');
    const explanationBanner = document.getElementById('quiz-explanation-banner');
    const completeScreen = document.getElementById('quiz-complete-screen');

    interactiveBody.classList.add('hidden');
    explanationBanner.classList.add('hidden');
    completeScreen.classList.remove('hidden');

    document.getElementById('final-score-digit').textContent = quizScore;
    const rankTitle = document.getElementById('detective-rank-title');
    const rankText = document.getElementById('detective-rank-text');

    if (quizScore === 5) {
      rankTitle.textContent = 'HONORARY FORENSIC STYLISTICIAN // LEVEL 5';
      rankTitle.style.color = 'var(--silver-light)';
      rankText.textContent = 'Flawless analysis. You demonstrated rigorous mastery over frequency distributions, the key triad, Golding’s secondary norm, and perspective foregrounding.';
      launchFestivalCelebration();
    } else if (quizScore >= 3) {
      rankTitle.textContent = 'SENIOR STYLISTIC INVESTIGATOR // LEVEL 3';
      rankTitle.style.color = '#93C5FD';
      rankText.textContent = 'Strong investigation. You successfully identified primary stylistic markers and authorial tendencies with commendable precision.';
    } else {
      rankTitle.textContent = 'JUNIOR FORENSIC APPRENTICE // LEVEL 1';
      rankTitle.style.color = 'var(--silver-dim)';
      rankText.textContent = 'Investigation incomplete. Re-examine the benchmark table and key triad to solidify your understanding of stylistic norms.';
    }
  }

  function resetQuiz() {
    currentQIndex = 0;
    quizScore = 0;
    renderQuizQuestion(0);
  }

  function triggerSlideAction(slideIdx) {
    if (slideIdx === 0) playStampSlam();
    else if (slideIdx === 6) {
      // Takeaway slide impact
    }
    else if (slideIdx === 8) playStampSlam();
  }

  // ==========================================
  // 9. INITIALIZATION
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    init3DScene();
    setupCinematicIntro();
    initNavigation();
    initQuizEngine();
    resizeFestivalCanvas();
  });

})();
