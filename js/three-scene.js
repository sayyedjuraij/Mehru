/* ══════════════════════════════════════════
   NEXYOS — THREE.JS 3D SCENE
   js/three-scene.js
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 28);

  /* ── LIGHTS ── */
  const ambientLight = new THREE.AmbientLight(0x00ffe1, 0.1);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00ffe1, 2, 60);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x7b2fff, 1.5, 60);
  pointLight2.position.set(-15, -8, 5);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xff2f6e, 1, 50);
  pointLight3.position.set(5, -15, -10);
  scene.add(pointLight3);

  /* ── PARTICLE FIELD ── */
  const PARTICLE_COUNT = 2200;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const velocities = [];

  const palette = [
    new THREE.Color(0x00ffe1),
    new THREE.Color(0x7b2fff),
    new THREE.Color(0xff2f6e),
    new THREE.Color(0x00bfff),
    new THREE.Color(0xffffff),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 22 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
    velocities.push({
      theta: (Math.random() - 0.5) * 0.003,
      phi:   (Math.random() - 0.5) * 0.002,
      r:     r,
    });
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  particleGeo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uTime;
      uniform float uPixelRatio;
      void main() {
        vColor = color;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * uPixelRatio * (200.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;
        float alpha = 1.0 - smoothstep(0.3, 1.0, d);
        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── CENTRAL WIREFRAME ICOSAHEDRON ── */
  const icosaGeo = new THREE.IcosahedronGeometry(6, 1);
  const icosaMat = new THREE.MeshStandardMaterial({
    color: 0x00ffe1,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
    emissive: 0x00ffe1,
    emissiveIntensity: 0.3,
  });
  const icosa = new THREE.Mesh(icosaGeo, icosaMat);
  scene.add(icosa);

  /* ── INNER DODECAHEDRON ── */
  const dodecaGeo = new THREE.DodecahedronGeometry(3.5, 0);
  const dodecaMat = new THREE.MeshStandardMaterial({
    color: 0x7b2fff,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
    emissive: 0x7b2fff,
    emissiveIntensity: 0.5,
  });
  const dodeca = new THREE.Mesh(dodecaGeo, dodecaMat);
  scene.add(dodeca);

  /* ── CORE GLOW SPHERE ── */
  const coreGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const coreMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0x00ffe1) },
      uColor2: { value: new THREE.Color(0x7b2fff) },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
        float t = sin(uTime * 0.8) * 0.5 + 0.5;
        vec3 col = mix(uColor1, uColor2, t);
        gl_FragColor = vec4(col * fresnel, fresnel * 0.9);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  /* ── RING TORUS ── */
  const torusMats = [0x00ffe1, 0x7b2fff, 0xff2f6e].map((c, i) => ({
    mesh: (() => {
      const g = new THREE.TorusGeometry(7 + i * 2.5, 0.05, 8, 120);
      const m = new THREE.MeshStandardMaterial({
        color: c, emissive: c, emissiveIntensity: 1,
        transparent: true, opacity: 0.5 - i * 0.1,
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = (i * Math.PI) / 3;
      mesh.rotation.y = (i * Math.PI) / 5;
      scene.add(mesh);
      return mesh;
    })(),
    speed: 0.004 - i * 0.001,
    axis: new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize(),
  }));

  /* ── FLOATING DATA NODES ── */
  const nodeGroup = new THREE.Group();
  const nodeCount = 14;
  const nodeData = [];
  for (let i = 0; i < nodeCount; i++) {
    const r = 8 + Math.random() * 4;
    const theta = (i / nodeCount) * Math.PI * 2;
    const y = (Math.random() - 0.5) * 10;
    const nodeGeo = new THREE.OctahedronGeometry(0.3 + Math.random() * 0.3, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: palette[i % palette.length].getHex(),
      emissive: palette[i % palette.length].getHex(),
      emissiveIntensity: 1.5,
      transparent: true, opacity: 0.8,
    });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
    nodeGroup.add(node);
    nodeData.push({ theta, r, y, speed: 0.003 + Math.random() * 0.004, phase: Math.random() * Math.PI * 2 });
  }
  scene.add(nodeGroup);

  /* ── GRID PLANE ── */
  const gridHelper = new THREE.GridHelper(60, 30, 0x00ffe1, 0x00ffe1);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.04;
  gridHelper.position.y = -14;
  scene.add(gridHelper);

  /* ── MOUSE PARALLAX ── */
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  document.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── SCROLL ── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  /* ── RESIZE ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /* ── ANIMATION LOOP ── */
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Camera parallax
    camera.position.x = mouse.x * 3;
    camera.position.y = -mouse.y * 2 - scrollY * 0.004;
    camera.lookAt(scene.position);

    // Core geometry
    icosa.rotation.x = t * 0.06 + mouse.y * 0.1;
    icosa.rotation.y = t * 0.09 + mouse.x * 0.1;
    dodeca.rotation.x = -t * 0.08;
    dodeca.rotation.y = t * 0.12;

    // Pulse scale on core
    const pulse = 1 + Math.sin(t * 1.5) * 0.08;
    core.scale.setScalar(pulse);
    coreMat.uniforms.uTime.value = t;

    // Rings
    torusMats.forEach((r) => {
      r.mesh.rotateOnAxis(r.axis, r.speed);
    });

    // Floating nodes
    nodeData.forEach((nd, i) => {
      nd.theta += nd.speed;
      const node = nodeGroup.children[i];
      node.position.x = Math.cos(nd.theta) * nd.r;
      node.position.z = Math.sin(nd.theta) * nd.r;
      node.position.y = nd.y + Math.sin(t * 0.5 + nd.phase) * 1.5;
      node.rotation.x = t * 0.8;
      node.rotation.y = t * 0.6;
    });

    // Particles wave
    particleMat.uniforms.uTime.value = t;
    particles.rotation.y = t * 0.015;
    particles.rotation.x = Math.sin(t * 0.05) * 0.08;

    // Light animation
    pointLight1.position.x = Math.sin(t * 0.5) * 12;
    pointLight1.position.y = Math.cos(t * 0.4) * 8;
    pointLight2.position.x = Math.cos(t * 0.3) * -12;
    pointLight2.position.z = Math.sin(t * 0.6) * 8;

    renderer.render(scene, camera);
  }

  animate();

  // Expose for external use
  window._nexyosScene = { scene, camera, renderer };
})();
