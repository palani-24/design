import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useCADStore } from '../../store/useCADStore';
import { getTranslation } from '../../shared/i18n';
import {
  Eye,
  EyeOff,
  Wind,
  RotateCcw,
  Sparkles,
  Layers,
  Activity,
  Compass,
  Camera,
  Sun,
  Grid,
} from 'lucide-react';

export const Clo3DViewport: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const {
    language,
    isSimulating,
    toggleSimulation,
    windEnabled,
    toggleWind,
    surfaceMode,
    setSurfaceMode,
    avatarVisible,
    toggleAvatarVisible,
    garmentVisible,
    toggleGarmentVisible,
    activeFabric,
    selectedAvatarPose,
    garment,
    currentSize,
    sloperDeltas,
  } = useCADStore();

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // References for Three.js animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const leftArmGroupRef = useRef<THREE.Group | null>(null);
  const rightArmGroupRef = useRef<THREE.Group | null>(null);
  const garmentGroupRef = useRef<THREE.Group | null>(null);
  const simulatingMeshesRef = useRef<
    Array<{
      mesh: THREE.Mesh;
      origPositions: Float32Array;
      height: number;
      intensity: number;
    }>
  >([]);

  // Camera Orbit State
  const isDraggingRef = useRef(false);
  const dragButtonRef = useRef(0);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraOrbitRef = useRef({
    theta: 0, // azimuthal angle (horizontal)
    phi: Math.PI / 2.05, // polar angle (vertical)
    radius: 3.4, // distance to target
    target: new THREE.Vector3(0, 0.95, 0), // center on avatar chest/waist
  });

  const [fps, setFps] = useState(60);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Background (CLO 3D Studio Warm Gray Studio Gradient)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#9499a3'); // Matches the soft warm gray background
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    const updateCameraPos = () => {
      const { theta, phi, radius, target } = cameraOrbitRef.current;
      camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = target.y + radius * Math.cos(phi);
      camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(target);
    };
    updateCameraPos();

    // 3. Renderer with soft shadow maps
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Studio Lighting Rig (Cinematic Key, Fill & Rim Lights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    // Key Light (Warm frontal-left directional light with shadows)
    const keyLight = new THREE.DirectionalLight(0xfff6ea, 1.25);
    keyLight.position.set(2.5, 4.5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 10;
    keyLight.shadow.camera.left = -2;
    keyLight.shadow.camera.right = 2;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -1;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (Cool right-side soft directional light)
    const fillLight = new THREE.DirectionalLight(0xdce7f9, 0.65);
    fillLight.position.set(-3, 2.5, 2);
    scene.add(fillLight);

    // Rim / Hair Light (Backlight for beautiful edge separation)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0, 3.5, -3.5);
    scene.add(rimLight);

    // 5. Floor & Grid (Matches CLO 3D Ground Shadow & Grid)
    const gridHelper = new THREE.GridHelper(6, 40, 0x71717a, 0x828894);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Shadow receiver plane on the floor
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.22 });
    const shadowPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.001;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // 6. Build High-Fidelity Female Avatar (A-Pose)
    const avatarGroup = new THREE.Group();
    avatarGroupRef.current = avatarGroup;

    // Skin Material (Mannequin Porcelain Peach)
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfab92,
      roughness: 0.5,
      metalness: 0.05,
    });

    // Hair Material (Dark Brunette / Black Bun)
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1917,
      roughness: 0.65,
    });

    // Shoes Material (Black High Heels)
    const shoeMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
      metalness: 0.2,
    });

    // Head
    const headGeom = new THREE.SphereGeometry(0.095, 24, 24);
    headGeom.scale(1, 1.25, 1.05);
    const head = new THREE.Mesh(headGeom, skinMaterial);
    head.position.set(0, 1.62, 0);
    head.castShadow = true;
    avatarGroup.add(head);

    // Hair Style (Sleek Bun / Middle Part)
    const hairGeom = new THREE.SphereGeometry(0.102, 20, 20);
    hairGeom.scale(1.02, 1.22, 1.08);
    const hair = new THREE.Mesh(hairGeom, hairMaterial);
    hair.position.set(0, 1.64, -0.015);
    avatarGroup.add(hair);

    // Neck
    const neckGeom = new THREE.CylinderGeometry(0.042, 0.048, 0.1, 16);
    const neck = new THREE.Mesh(neckGeom, skinMaterial);
    neck.position.set(0, 1.48, 0);
    avatarGroup.add(neck);

    // Torso / Bust / Hips
    const chestGeom = new THREE.CylinderGeometry(0.145, 0.13, 0.22, 20);
    chestGeom.scale(1.15, 1, 0.85);
    const chest = new THREE.Mesh(chestGeom, skinMaterial);
    chest.position.set(0, 1.34, 0);
    chest.castShadow = true;
    avatarGroup.add(chest);

    // Waist
    const waistGeom = new THREE.CylinderGeometry(0.125, 0.14, 0.16, 20);
    waistGeom.scale(1.1, 1, 0.82);
    const waist = new THREE.Mesh(waistGeom, skinMaterial);
    waist.position.set(0, 1.16, 0);
    waist.castShadow = true;
    avatarGroup.add(waist);

    // Pelvis / Hips
    const pelvisGeom = new THREE.CylinderGeometry(0.14, 0.165, 0.18, 20);
    pelvisGeom.scale(1.18, 1, 0.88);
    const pelvis = new THREE.Mesh(pelvisGeom, skinMaterial);
    pelvis.position.set(0, 1.0, 0);
    pelvis.castShadow = true;
    avatarGroup.add(pelvis);

    // Arms in A-Pose
    const armAngle = 0.52; // radians (~30 deg)

    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroupRef.current = leftArmGroup;
    leftArmGroup.position.set(0.19, 1.42, 0);
    leftArmGroup.rotation.z = -armAngle;

    const armUpperGeom = new THREE.CylinderGeometry(0.034, 0.028, 0.28, 14);
    const leftArmUpper = new THREE.Mesh(armUpperGeom, skinMaterial);
    leftArmUpper.position.set(0, -0.14, 0);
    leftArmUpper.castShadow = true;
    leftArmGroup.add(leftArmUpper);

    const armLowerGeom = new THREE.CylinderGeometry(0.027, 0.022, 0.26, 14);
    const leftArmLower = new THREE.Mesh(armLowerGeom, skinMaterial);
    leftArmLower.position.set(0, -0.4, 0);
    leftArmLower.castShadow = true;
    leftArmGroup.add(leftArmLower);

    const handGeom = new THREE.BoxGeometry(0.02, 0.08, 0.045);
    const leftHand = new THREE.Mesh(handGeom, skinMaterial);
    leftHand.position.set(0, -0.56, 0);
    leftArmGroup.add(leftHand);

    avatarGroup.add(leftArmGroup);

    // Right Arm (Mirrored)
    const rightArmGroup = new THREE.Group();
    rightArmGroupRef.current = rightArmGroup;
    rightArmGroup.position.set(-0.19, 1.42, 0);
    rightArmGroup.rotation.z = armAngle;

    const rightArmUpper = new THREE.Mesh(armUpperGeom, skinMaterial);
    rightArmUpper.position.set(0, -0.14, 0);
    rightArmUpper.castShadow = true;
    rightArmGroup.add(rightArmUpper);

    const rightArmLower = new THREE.Mesh(armLowerGeom, skinMaterial);
    rightArmLower.position.set(0, -0.4, 0);
    rightArmLower.castShadow = true;
    rightArmGroup.add(rightArmLower);

    const rightHand = new THREE.Mesh(handGeom, skinMaterial);
    rightHand.position.set(0, -0.56, 0);
    rightArmGroup.add(rightHand);

    avatarGroup.add(rightArmGroup);

    // Legs (Thighs, Calves, Heels)
    const legOffset = 0.095;
    [-legOffset, legOffset].forEach((xPos) => {
      // Thigh
      const thighGeom = new THREE.CylinderGeometry(0.075, 0.05, 0.44, 16);
      thighGeom.scale(1.05, 1, 1.05);
      const thigh = new THREE.Mesh(thighGeom, skinMaterial);
      thigh.position.set(xPos, 0.72, 0);
      thigh.castShadow = true;
      avatarGroup.add(thigh);

      // Calf
      const calfGeom = new THREE.CylinderGeometry(0.048, 0.033, 0.44, 16);
      calfGeom.scale(1.05, 1, 1.05);
      const calf = new THREE.Mesh(calfGeom, skinMaterial);
      calf.position.set(xPos, 0.3, 0);
      calf.castShadow = true;
      avatarGroup.add(calf);

      // High Heel Shoe
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(xPos, 0.05, 0.02);

      const footGeom = new THREE.BoxGeometry(0.065, 0.045, 0.14);
      const foot = new THREE.Mesh(footGeom, shoeMaterial);
      shoeGroup.add(foot);

      // Heel peg
      const heelPegGeom = new THREE.CylinderGeometry(0.01, 0.008, 0.07, 10);
      const heelPeg = new THREE.Mesh(heelPegGeom, shoeMaterial);
      heelPeg.position.set(0, -0.02, -0.045);
      shoeGroup.add(heelPeg);

      avatarGroup.add(shoeGroup);
    });

    scene.add(avatarGroup);

    // 7. Garment Root Group
    const garmentGroup = new THREE.Group();
    scene.add(garmentGroup);
    garmentGroupRef.current = garmentGroup;

    // 8. Animation & Physics Simulation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let frameCount = 0;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      // Live Cloth Drape Simulation Animation across all registered meshes
      const storeState = useCADStore.getState();
      if (storeState.isSimulating && simulatingMeshesRef.current.length > 0) {
        const speed = 2.4;
        const wind = storeState.windEnabled ? 0.024 : 0.007;

        simulatingMeshesRef.current.forEach(({ mesh, origPositions, height, intensity }) => {
          if (!mesh.geometry || !mesh.geometry.attributes.position) return;
          const positions = mesh.geometry.attributes.position;
          const count = positions.count;

          for (let i = 0; i < count; i++) {
            const ox = origPositions[i * 3];
            const oy = origPositions[i * 3 + 1];
            const oz = origPositions[i * 3 + 2];

            // Wave amplitude increases towards the bottom hem
            const hemFactor = Math.max(0, 1.0 - (oy + height / 2) / height);
            const wave =
              (Math.sin(elapsedTime * speed + ox * 10 + oz * 8) * wind * hemFactor +
                Math.cos(elapsedTime * 1.6 + oz * 7) * (wind * 0.5) * hemFactor) *
              intensity;

            positions.setXYZ(i, ox + wave * 0.4, oy, oz + wave);
          }
          positions.needsUpdate = true;
          mesh.geometry.computeVertexNormals();
        });
      }

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Dynamically generate and drape 3D Garment whenever garment, size, color, surfaceMode, or sloper changes
  useEffect(() => {
    if (!sceneRef.current || !garmentGroupRef.current) return;
    const garmentGroup = garmentGroupRef.current;

    // 1. Clean up existing garment meshes & materials
    while (garmentGroup.children.length > 0) {
      const child = garmentGroup.children[0];
      garmentGroup.remove(child);
      if ((child as THREE.Mesh).geometry) {
        (child as THREE.Mesh).geometry.dispose();
      }
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat.dispose();
      }
    }
    simulatingMeshesRef.current = [];

    garmentGroup.visible = garmentVisible;
    if (!garmentVisible) return;

    // 2. Identify Garment Archetype
    const nameLower = (garment.name || '').toLowerCase();
    const catLower = (garment.category || '').toLowerCase();

    const isPant =
      catLower.includes('trouser') ||
      catLower.includes('pant') ||
      catLower.includes('jean') ||
      nameLower.includes('trouser') ||
      nameLower.includes('pant') ||
      nameLower.includes('jean') ||
      nameLower.includes('chino') ||
      nameLower.includes('bootcut');

    const isShirt =
      catLower.includes('shirt') ||
      catLower.includes('polo') ||
      catLower.includes('tshirt') ||
      nameLower.includes('shirt') ||
      nameLower.includes('polo') ||
      nameLower.includes('t-shirt') ||
      nameLower.includes('tshirt');

    const isJacket =
      catLower.includes('jacket') ||
      catLower.includes('blazer') ||
      catLower.includes('coat') ||
      nameLower.includes('jacket') ||
      nameLower.includes('blazer') ||
      nameLower.includes('coat') ||
      nameLower.includes('bomber');

    const isSkirt = nameLower.includes('skirt') || catLower.includes('skirt');
    const isDress = nameLower.includes('dress') || catLower.includes('dress');

    // 3. Proportional Scaling based on Current Size & Sloper Sizing Deltas
    const sizeScaleMap: Record<string, number> = {
      XS: 0.94,
      S: 0.97,
      M: 1.0,
      L: 1.035,
      XL: 1.075,
      XXL: 1.12,
    };
    const baseScale = sizeScaleMap[currentSize] || 1.0;
    const bustScale = baseScale * (1 + (sloperDeltas?.bust || 0) * 0.007);
    const waistScale = baseScale * (1 + (sloperDeltas?.waist || 0) * 0.007);
    const lengthScale = 1 + (sloperDeltas?.length || 0) * 0.005;

    // Helper to generate Material based on active surfaceMode
    const createMat = (colorHex: string, isPrimary: boolean = true) => {
      if (surfaceMode === 'wireframe') {
        return new THREE.MeshStandardMaterial({
          color: isPrimary ? '#38bdf8' : '#0284c7',
          wireframe: true,
          side: THREE.DoubleSide,
        });
      }
      if (surfaceMode === 'stressMap') {
        return new THREE.MeshStandardMaterial({
          color: isPrimary ? (isPant ? '#22c55e' : '#f59e0b') : '#38bdf8',
          roughness: 0.45,
          side: THREE.DoubleSide,
        });
      }
      if (surfaceMode === 'translucent') {
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color(colorHex),
          transparent: true,
          opacity: 0.52,
          roughness: 0.45,
          metalness: 0.04,
          side: THREE.DoubleSide,
        });
      }
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.46,
        metalness: 0.04,
        side: THREE.DoubleSide,
      });
    };

    const primaryColor = activeFabric.color;

    // Helper to register mesh for cloth physics simulation
    const registerClothSimulation = (
      mesh: THREE.Mesh,
      height: number,
      intensity: number = 1.0
    ) => {
      const posAttr = mesh.geometry.attributes.position;
      const origPositions = new Float32Array(posAttr.count * 3);
      for (let i = 0; i < posAttr.count; i++) {
        origPositions[i * 3] = posAttr.getX(i);
        origPositions[i * 3 + 1] = posAttr.getY(i);
        origPositions[i * 3 + 2] = posAttr.getZ(i);
      }
      simulatingMeshesRef.current.push({
        mesh,
        origPositions,
        height,
        intensity,
      });
    };

    // ==============================================================
    // A. PANTS / TROUSERS / JEANS ARCHETYPE
    // ==============================================================
    if (isPant) {
      // 1. Waistband & Pelvis Area
      const wbGeom = new THREE.CylinderGeometry(0.144 * waistScale, 0.168 * waistScale, 0.18, 36, 16, true);
      wbGeom.scale(1.20, 1, 0.90);
      const wbMesh = new THREE.Mesh(wbGeom, createMat(primaryColor, true));
      wbMesh.position.set(0, 1.04, 0);
      wbMesh.castShadow = true;
      garmentGroup.add(wbMesh);

      // 2. Left & Right Trouser Legs
      const legHeight = 0.84 * lengthScale;
      const topR = 0.082 * waistScale;
      const bottomR = nameLower.includes('bootcut') ? 0.072 : 0.056;

      [-0.095, 0.095].forEach((xPos) => {
        const legGeom = new THREE.CylinderGeometry(topR, bottomR, legHeight, 36, 32, true);
        const posAttr = legGeom.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < posAttr.count; i++) {
          v.fromBufferAttribute(posAttr, i);
          // Subtle crease line along front for sharp trouser styling
          if (v.z > 0.02) {
            v.z += (1 - Math.min(1, Math.abs(v.x) / 0.07)) * 0.005;
          }
          // Knee ripple around mid-height
          const relY = v.y / legHeight;
          if (relY > -0.15 && relY < 0.15) {
            v.z += Math.sin(relY * 20) * 0.003;
          }
          posAttr.setXYZ(i, v.x, v.y, v.z);
        }
        legGeom.computeVertexNormals();

        const legMesh = new THREE.Mesh(legGeom, createMat(primaryColor, true));
        legMesh.position.set(xPos, 0.58, 0);
        legMesh.castShadow = true;
        garmentGroup.add(legMesh);
        registerClothSimulation(legMesh, legHeight, 0.7);
      });

      // 3. Front Fly Detail
      const flyGeom = new THREE.BoxGeometry(0.016, 0.13, 0.005);
      const flyMesh = new THREE.Mesh(flyGeom, createMat(primaryColor, true));
      flyMesh.position.set(0, 1.05, 0.145 * waistScale);
      garmentGroup.add(flyMesh);

      // 4. Coordinated Upper Top (Ivory heather camisole tucked into waistband)
      const topGeom = new THREE.CylinderGeometry(0.148 * bustScale, 0.136 * waistScale, 0.28, 36, 16, true);
      topGeom.scale(1.18, 1, 0.86);
      const topMesh = new THREE.Mesh(topGeom, createMat('#f1f5f9', false));
      topMesh.position.set(0, 1.28, 0);
      topMesh.castShadow = true;
      garmentGroup.add(topMesh);
    }
    // ==============================================================
    // B. SHIRT / POLO / T-SHIRT ARCHETYPE
    // ==============================================================
    else if (isShirt) {
      // 1. Shirt Torso
      const shirtHeight = 0.42 * lengthScale;
      const torsoGeom = new THREE.CylinderGeometry(
        0.164 * bustScale,
        0.156 * waistScale,
        shirtHeight,
        40,
        24,
        true
      );
      torsoGeom.scale(1.20, 1, 0.88);
      const torsoMesh = new THREE.Mesh(torsoGeom, createMat(primaryColor, true));
      torsoMesh.position.set(0, 1.25, 0);
      torsoMesh.castShadow = true;
      garmentGroup.add(torsoMesh);
      registerClothSimulation(torsoMesh, shirtHeight, 0.8);

      // 2. Button Placket & Pearl Buttons
      const placketGeom = new THREE.BoxGeometry(0.024, shirtHeight * 0.94, 0.006);
      const placketMesh = new THREE.Mesh(placketGeom, createMat(primaryColor, true));
      placketMesh.position.set(0, 1.25, 0.144 * bustScale);
      garmentGroup.add(placketMesh);

      const buttonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
      [-0.14, -0.06, 0.02, 0.10, 0.17].forEach((yOff) => {
        const btnGeom = new THREE.SphereGeometry(0.005, 8, 8);
        const btn = new THREE.Mesh(btnGeom, buttonMat);
        btn.position.set(0, 1.25 + yOff, 0.148 * bustScale);
        garmentGroup.add(btn);
      });

      // 3. Collar Stand & Leaf
      const collarGeom = new THREE.CylinderGeometry(0.082, 0.088, 0.055, 32, 8, true);
      collarGeom.scale(1.1, 1, 1.05);
      const collarMesh = new THREE.Mesh(collarGeom, createMat(primaryColor, true));
      collarMesh.position.set(0, 1.46, 0);
      garmentGroup.add(collarMesh);

      // 4. Left & Right Sleeves
      const isLongSleeve = !nameLower.includes('t-shirt') && !nameLower.includes('tshirt') && !nameLower.includes('polo');
      const sleeveLen = isLongSleeve ? 0.44 : 0.22;
      const sleeveTopR = 0.048 * bustScale;
      const sleeveBotR = isLongSleeve ? 0.036 : 0.042;
      const armAngle = 0.52;

      // Left Sleeve
      const leftSleeveGeom = new THREE.CylinderGeometry(sleeveTopR, sleeveBotR, sleeveLen, 24, 16, true);
      const leftSleeveMesh = new THREE.Mesh(leftSleeveGeom, createMat(primaryColor, true));
      leftSleeveMesh.position.set(
        0.19 + Math.sin(armAngle) * (sleeveLen / 2),
        1.42 - Math.cos(armAngle) * (sleeveLen / 2),
        0
      );
      leftSleeveMesh.rotation.z = -armAngle;
      leftSleeveMesh.castShadow = true;
      garmentGroup.add(leftSleeveMesh);
      registerClothSimulation(leftSleeveMesh, sleeveLen, 0.5);

      // Right Sleeve
      const rightSleeveGeom = new THREE.CylinderGeometry(sleeveTopR, sleeveBotR, sleeveLen, 24, 16, true);
      const rightSleeveMesh = new THREE.Mesh(rightSleeveGeom, createMat(primaryColor, true));
      rightSleeveMesh.position.set(
        -0.19 - Math.sin(armAngle) * (sleeveLen / 2),
        1.42 - Math.cos(armAngle) * (sleeveLen / 2),
        0
      );
      rightSleeveMesh.rotation.z = armAngle;
      rightSleeveMesh.castShadow = true;
      garmentGroup.add(rightSleeveMesh);
      registerClothSimulation(rightSleeveMesh, sleeveLen, 0.5);

      // 5. Coordinated Tailored Pants on bottom (Dark Charcoal #1e293b)
      [-0.095, 0.095].forEach((xPos) => {
        const trouserGeom = new THREE.CylinderGeometry(0.08, 0.055, 0.84, 24, 16, true);
        const trouserMesh = new THREE.Mesh(trouserGeom, createMat('#1e293b', false));
        trouserMesh.position.set(xPos, 0.58, 0);
        trouserMesh.castShadow = true;
        garmentGroup.add(trouserMesh);
      });
    }
    // ==============================================================
    // C. JACKET / OUTERWEAR ARCHETYPE
    // ==============================================================
    else if (isJacket) {
      const jacketHeight = 0.48 * lengthScale;
      const jacketGeom = new THREE.CylinderGeometry(
        0.174 * bustScale,
        0.162 * waistScale,
        jacketHeight,
        40,
        24,
        true
      );
      jacketGeom.scale(1.22, 1, 0.92);
      const jacketMesh = new THREE.Mesh(jacketGeom, createMat(primaryColor, true));
      jacketMesh.position.set(0, 1.22, 0);
      jacketMesh.castShadow = true;
      garmentGroup.add(jacketMesh);
      registerClothSimulation(jacketMesh, jacketHeight, 0.6);

      // Lapels
      const lapelGeom = new THREE.BoxGeometry(0.08, 0.28, 0.008);
      const leftLapel = new THREE.Mesh(lapelGeom, createMat(primaryColor, true));
      leftLapel.position.set(0.05, 1.32, 0.155 * bustScale);
      leftLapel.rotation.z = -0.15;
      garmentGroup.add(leftLapel);

      const rightLapel = new THREE.Mesh(lapelGeom, createMat(primaryColor, true));
      rightLapel.position.set(-0.05, 1.32, 0.155 * bustScale);
      rightLapel.rotation.z = 0.15;
      garmentGroup.add(rightLapel);

      // Sleeves
      const armAngle = 0.52;
      const sleeveLen = 0.46;
      [-1, 1].forEach((dir) => {
        const sGeom = new THREE.CylinderGeometry(0.052 * bustScale, 0.038, sleeveLen, 24, 16, true);
        const sMesh = new THREE.Mesh(sGeom, createMat(primaryColor, true));
        sMesh.position.set(
          dir * (0.19 + Math.sin(armAngle) * (sleeveLen / 2)),
          1.42 - Math.cos(armAngle) * (sleeveLen / 2),
          0
        );
        sMesh.rotation.z = -dir * armAngle;
        sMesh.castShadow = true;
        garmentGroup.add(sMesh);
        registerClothSimulation(sMesh, sleeveLen, 0.4);
      });

      // Coordinated Dark Trousers
      [-0.095, 0.095].forEach((xPos) => {
        const trouserGeom = new THREE.CylinderGeometry(0.08, 0.055, 0.84, 24, 16, true);
        const trouserMesh = new THREE.Mesh(trouserGeom, createMat('#18181b', false));
        trouserMesh.position.set(xPos, 0.58, 0);
        trouserMesh.castShadow = true;
        garmentGroup.add(trouserMesh);
      });
    }
    // ==============================================================
    // D. FLARED SKIRT ARCHETYPE
    // ==============================================================
    else if (isSkirt) {
      const skirtHeight = 0.46 * lengthScale;
      const skirtGeom = new THREE.CylinderGeometry(0.145 * waistScale, 0.38, skirtHeight, 64, 32, true);
      skirtGeom.scale(1.15, 1, 0.95);

      // 8 Drape wave flutes radiating downwards
      const posAttr = skirtGeom.attributes.position;
      const vertex = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        const tHeight = 1.0 - (vertex.y + skirtHeight / 2) / skirtHeight;
        const angle = Math.atan2(vertex.z, vertex.x);
        const ripple = Math.sin(angle * 7) * 0.024 * tHeight;
        vertex.x += Math.cos(angle) * ripple;
        vertex.z += Math.sin(angle) * ripple;
        posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      skirtGeom.computeVertexNormals();

      const skirtMesh = new THREE.Mesh(skirtGeom, createMat(primaryColor, true));
      skirtMesh.position.set(0, 0.94, 0);
      skirtMesh.castShadow = true;
      garmentGroup.add(skirtMesh);
      registerClothSimulation(skirtMesh, skirtHeight, 1.0);

      // Coordinated fitted top
      const topGeom = new THREE.CylinderGeometry(0.155 * bustScale, 0.138 * waistScale, 0.28, 36, 16, true);
      topGeom.scale(1.18, 1, 0.88);
      const topMesh = new THREE.Mesh(topGeom, createMat('#f8fafc', false));
      topMesh.position.set(0, 1.28, 0);
      topMesh.castShadow = true;
      garmentGroup.add(topMesh);
    }
    // ==============================================================
    // E. DRESS ARCHETYPE
    // ==============================================================
    else if (isDress) {
      const dressHeight = 0.72 * lengthScale;
      const dressGeom = new THREE.CylinderGeometry(
        0.156 * bustScale,
        0.22,
        dressHeight,
        54,
        32,
        true
      );
      dressGeom.scale(1.18, 1, 0.90);
      const dressMesh = new THREE.Mesh(dressGeom, createMat(primaryColor, true));
      dressMesh.position.set(0, 1.05, 0);
      dressMesh.castShadow = true;
      garmentGroup.add(dressMesh);
      registerClothSimulation(dressMesh, dressHeight, 0.9);
    }
    // ==============================================================
    // F. BASIC BODICE ARCHETYPE (Default)
    // ==============================================================
    else {
      // Cropped Bodice Top
      const bodiceGeom = new THREE.CylinderGeometry(0.155 * bustScale, 0.138 * waistScale, 0.28, 36, 16, true);
      bodiceGeom.scale(1.18, 1, 0.88);
      const bodiceMesh = new THREE.Mesh(bodiceGeom, createMat(primaryColor, true));
      bodiceMesh.position.set(0, 1.28, 0);
      bodiceMesh.castShadow = true;
      garmentGroup.add(bodiceMesh);
      registerClothSimulation(bodiceMesh, 0.28, 0.4);

      // Coordinated Flared Skirt
      const skirtHeight = 0.46;
      const skirtGeom = new THREE.CylinderGeometry(0.145, 0.38, skirtHeight, 64, 32, true);
      skirtGeom.scale(1.15, 1, 0.95);
      const posAttr = skirtGeom.attributes.position;
      const vertex = new THREE.Vector3();
      for (let i = 0; i < posAttr.count; i++) {
        vertex.fromBufferAttribute(posAttr, i);
        const tHeight = 1.0 - (vertex.y + skirtHeight / 2) / skirtHeight;
        const angle = Math.atan2(vertex.z, vertex.x);
        const ripple = Math.sin(angle * 7) * 0.024 * tHeight;
        vertex.x += Math.cos(angle) * ripple;
        vertex.z += Math.sin(angle) * ripple;
        posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      skirtGeom.computeVertexNormals();

      const skirtMesh = new THREE.Mesh(skirtGeom, createMat('#f8fafc', false));
      skirtMesh.position.set(0, 0.94, 0);
      skirtMesh.castShadow = true;
      garmentGroup.add(skirtMesh);
      registerClothSimulation(skirtMesh, skirtHeight, 1.0);
    }
  }, [
    garment.name,
    garment.category,
    currentSize,
    activeFabric.color,
    surfaceMode,
    sloperDeltas,
    garmentVisible,
  ]);

  // Update Avatar Visibility
  useEffect(() => {
    if (avatarGroupRef.current) {
      avatarGroupRef.current.visible = avatarVisible;
    }
  }, [avatarVisible]);

  // Update Avatar Pose based on selectedAvatarPose
  useEffect(() => {
    if (!leftArmGroupRef.current || !rightArmGroupRef.current) return;
    const leftArm = leftArmGroupRef.current;
    const rightArm = rightArmGroupRef.current;

    switch (selectedAvatarPose) {
      case 'FV2_02_Aforsize':
        leftArm.rotation.set(0, 0, -0.85);
        rightArm.rotation.set(0, 0, 0.85);
        break;
      case 'FV2_03_Attention':
        leftArm.rotation.set(0, 0, -0.12);
        rightArm.rotation.set(0, 0, 0.12);
        break;
      case 'FV2_04':
        leftArm.rotation.set(0.15, 0, -0.38);
        rightArm.rotation.set(-0.25, 0, 0.65);
        break;
      case 'FV2_08_Running':
        leftArm.rotation.set(-0.7, 0, -0.28);
        rightArm.rotation.set(0.7, 0, 0.28);
        break;
      case 'FV2_09_Sitting':
        leftArm.rotation.set(0.55, 0, -0.2);
        rightArm.rotation.set(0.55, 0, 0.2);
        break;
      case 'FV2_10_ArmsUp':
        leftArm.rotation.set(0, 0, -1.35);
        rightArm.rotation.set(0, 0, 1.35);
        break;
      case 'FV2_01_A':
      default:
        leftArm.rotation.set(0, 0, -0.52);
        rightArm.rotation.set(0, 0, 0.52);
        break;
    }
  }, [selectedAvatarPose]);

  // Handle Mouse Events for Orbit / Pan / Zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragButtonRef.current = e.button;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !cameraRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    const orbit = cameraOrbitRef.current;

    if (dragButtonRef.current === 0) {
      // Left Click: Orbit Rotation
      orbit.theta -= deltaX * 0.008;
      orbit.phi = Math.max(0.1, Math.min(Math.PI - 0.1, orbit.phi - deltaY * 0.008));
    } else if (dragButtonRef.current === 2 || dragButtonRef.current === 1) {
      // Right or Middle Click: Pan
      const panSpeed = 0.003 * orbit.radius;
      orbit.target.x -= deltaX * panSpeed * Math.cos(orbit.theta);
      orbit.target.z += deltaX * panSpeed * Math.sin(orbit.theta);
      orbit.target.y += deltaY * panSpeed;
    }

    // Apply updated camera position
    const { theta, phi, radius, target } = orbit;
    cameraRef.current.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = target.y + radius * Math.cos(phi);
    cameraRef.current.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(target);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
    const orbit = cameraOrbitRef.current;
    orbit.radius = Math.max(1.2, Math.min(8.0, orbit.radius * zoomFactor));

    const { theta, phi, radius, target } = orbit;
    cameraRef.current.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = target.y + radius * Math.cos(phi);
    cameraRef.current.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(target);
  };

  // Preset Views (Front, Back, Side, Top)
  const setCameraPreset = (view: 'front' | 'back' | 'side' | 'top') => {
    if (!cameraRef.current) return;
    const orbit = cameraOrbitRef.current;
    if (view === 'front') {
      orbit.theta = 0;
      orbit.phi = Math.PI / 2.05;
    } else if (view === 'back') {
      orbit.theta = Math.PI;
      orbit.phi = Math.PI / 2.05;
    } else if (view === 'side') {
      orbit.theta = Math.PI / 2;
      orbit.phi = Math.PI / 2.05;
    } else if (view === 'top') {
      orbit.theta = 0;
      orbit.phi = 0.15;
    }
    const { theta, phi, radius, target } = orbit;
    cameraRef.current.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = target.y + radius * Math.cos(phi);
    cameraRef.current.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(target);
  };

  return (
    <div
      className="relative flex-1 h-full w-full overflow-hidden bg-[#9499a3] select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 1. Header Overlay: Project Filename matching CLO 3D */}
      <div className="absolute top-2.5 left-3 pointer-events-none flex items-center gap-2">
        <span className="font-mono text-xs text-[#2a2d34] bg-white/60 backdrop-blur-md px-2.5 py-1 rounded shadow-xs font-semibold">
          {garment.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.zprj
        </span>
        {isSimulating && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-white bg-[#00a8ff]/90 backdrop-blur-md px-2 py-0.5 rounded shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            {t('simulationActive')} ({fps} {t('fps')})
          </span>
        )}
      </div>

      {/* 2. Left Floating 3D Vertical CAD Toolbar (Matches CLO 3D Toolbar) */}
      <div className="absolute top-12 left-3 flex flex-col gap-1.5 bg-[#1e2025]/85 backdrop-blur-md p-1 rounded-md border border-[#343740] shadow-xl z-20">
        {/* Toggle Avatar Visibility */}
        <button
          onClick={toggleAvatarVisible}
          className={`p-1.5 rounded text-xs transition-colors ${
            avatarVisible ? 'bg-[#00a8ff] text-white' : 'text-[#8e909a] hover:text-white'
          }`}
          title="Toggle Avatar Display (Shift+A)"
        >
          {avatarVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Toggle Garment Drape Visibility */}
        <button
          onClick={toggleGarmentVisible}
          className={`p-1.5 rounded text-xs transition-colors ${
            garmentVisible ? 'bg-[#00a8ff] text-white' : 'text-[#8e909a] hover:text-white'
          }`}
          title="Toggle Garment Display (Shift+D)"
        >
          <Layers className="w-4 h-4" />
        </button>

        <div className="w-full h-[1px] bg-[#343740] my-0.5" />

        {/* Surface Modes */}
        <button
          onClick={() => setSurfaceMode('textured')}
          className={`p-1.5 rounded text-xs transition-colors ${
            surfaceMode === 'textured' ? 'bg-[#00a8ff] text-white' : 'text-[#8e909a] hover:text-white'
          }`}
          title={t('textured')}
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSurfaceMode('wireframe')}
          className={`p-1.5 rounded text-xs transition-colors ${
            surfaceMode === 'wireframe' ? 'bg-[#00a8ff] text-white' : 'text-[#8e909a] hover:text-white'
          }`}
          title={t('wireframe')}
        >
          <Grid className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSurfaceMode('stressMap')}
          className={`p-1.5 rounded text-xs transition-colors ${
            surfaceMode === 'stressMap' ? 'bg-amber-500 text-white' : 'text-[#8e909a] hover:text-white'
          }`}
          title={t('stressMap')}
        >
          <Activity className="w-4 h-4" />
        </button>

        <div className="w-full h-[1px] bg-[#343740] my-0.5" />

        {/* Wind Physics */}
        <button
          onClick={toggleWind}
          className={`p-1.5 rounded text-xs transition-colors ${
            windEnabled ? 'bg-teal-500 text-white shadow-sm' : 'text-[#8e909a] hover:text-white'
          }`}
          title={t('windBreeze')}
        >
          <Wind className="w-4 h-4" />
        </button>

        {/* Reset Camera View */}
        <button
          onClick={() => setCameraPreset('front')}
          className="p-1.5 rounded text-xs text-[#8e909a] hover:text-white hover:bg-[#2c2f38] transition-colors"
          title={t('resetDrape')}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Camera Quick Preset Buttons */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#1e2025]/85 backdrop-blur-md px-2 py-1 rounded border border-[#343740] shadow-md z-20 text-[10px]">
        <Camera className="w-3 h-3 text-[#00a8ff] mr-1" />
        <button
          onClick={() => setCameraPreset('front')}
          className="px-1.5 py-0.5 rounded hover:bg-[#2c2f38] text-zinc-300 font-mono"
        >
          {t('frontView')}
        </button>
        <button
          onClick={() => setCameraPreset('side')}
          className="px-1.5 py-0.5 rounded hover:bg-[#2c2f38] text-zinc-300 font-mono"
        >
          {t('sideView')}
        </button>
        <button
          onClick={() => setCameraPreset('back')}
          className="px-1.5 py-0.5 rounded hover:bg-[#2c2f38] text-zinc-300 font-mono"
        >
          {t('backView')}
        </button>
      </div>
    </div>
  );
};
