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
  } = useCADStore();

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  // References for Three.js animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const skirtMeshRef = useRef<THREE.Mesh | null>(null);
  const bodiceMeshRef = useRef<THREE.Mesh | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const leftArmGroupRef = useRef<THREE.Group | null>(null);
  const rightArmGroupRef = useRef<THREE.Group | null>(null);
  const originalSkirtPositionsRef = useRef<Float32Array | null>(null);

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
    scene.background = new THREE.Color('#9499a3'); // Matches the soft warm gray background in the screenshot
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

    // Hair Material (Dark Brunette / Black Bun as in screenshot)
    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1917,
      roughness: 0.65,
    });

    // Shoes Material (Black High Heels as in screenshot)
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

    // Arms in A-Pose (Angled at ~32 degrees, hands extended)
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

    // 7. Build Garment Meshes:
    // A. Cropped Sleeveless Bodice Top (Light Cyan #a5f3fc)
    const bodiceGeom = new THREE.CylinderGeometry(0.155, 0.138, 0.28, 36, 16, true);
    bodiceGeom.scale(1.18, 1, 0.88);

    // Bodice Material
    const bodiceMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a5f3fc'),
      roughness: 0.4,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const bodiceMesh = new THREE.Mesh(bodiceGeom, bodiceMat);
    bodiceMesh.position.set(0, 1.28, 0);
    bodiceMesh.castShadow = true;
    scene.add(bodiceMesh);
    bodiceMeshRef.current = bodiceMesh;

    // B. Flared A-Line Skirt (White #f8fafc with soft drape folds)
    // Parameterized cone/cylinder with high segment resolution for smooth drape waves
    const skirtHeight = 0.46;
    const skirtGeom = new THREE.CylinderGeometry(0.145, 0.38, skirtHeight, 64, 32, true);
    skirtGeom.scale(1.15, 1, 0.95);

    // Add gentle procedural drape flutes/folds into the skirt geometry
    const posAttr = skirtGeom.attributes.position;
    const vertex = new THREE.Vector3();
    const origPositions = new Float32Array(posAttr.count * 3);

    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);
      // Normalized height factor from top (waist=0) to hem (bottom=1)
      const tHeight = 1.0 - (vertex.y + skirtHeight / 2) / skirtHeight;
      const angle = Math.atan2(vertex.z, vertex.x);

      // 8 Flutes / Drape Wave ripples radiating outwards
      const ripple = Math.sin(angle * 7) * 0.024 * tHeight;
      vertex.x += Math.cos(angle) * ripple;
      vertex.z += Math.sin(angle) * ripple;

      posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);

      origPositions[i * 3] = vertex.x;
      origPositions[i * 3 + 1] = vertex.y;
      origPositions[i * 3 + 2] = vertex.z;
    }
    skirtGeom.computeVertexNormals();
    originalSkirtPositionsRef.current = origPositions;

    const skirtMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f8fafc'),
      roughness: 0.48,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });
    const skirtMesh = new THREE.Mesh(skirtGeom, skirtMat);
    skirtMesh.position.set(0, 0.94, 0);
    skirtMesh.castShadow = true;
    scene.add(skirtMesh);
    skirtMeshRef.current = skirtMesh;

    // 8. Animation & Physics Simulation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();
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

      // Live Cloth Drape Simulation Animation
      const storeState = useCADStore.getState();
      if (skirtMeshRef.current && originalSkirtPositionsRef.current) {
        const positions = skirtMeshRef.current.geometry.attributes.position;
        const orig = originalSkirtPositionsRef.current;
        const count = positions.count;

        if (storeState.isSimulating) {
          const speed = 2.4;
          const wind = storeState.windEnabled ? 0.02 : 0.005;

          for (let i = 0; i < count; i++) {
            const ox = orig[i * 3];
            const oy = orig[i * 3 + 1];
            const oz = orig[i * 3 + 2];

            // Bottom hem swings more than waist
            const hemFactor = Math.max(0, 0.23 - oy) / 0.46;
            const wave =
              Math.sin(elapsedTime * speed + ox * 12 + oz * 10) * wind * hemFactor +
              Math.cos(elapsedTime * 1.5 + oz * 8) * (wind * 0.5) * hemFactor;

            positions.setXYZ(i, ox + wave * 0.5, oy, oz + wave);
          }
          positions.needsUpdate = true;
          skirtMeshRef.current.geometry.computeVertexNormals();
        }
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

  // Update Surface Modes (Textured, Wireframe, Stress Heat Map, Translucent)
  useEffect(() => {
    if (!skirtMeshRef.current || !bodiceMeshRef.current) return;

    const skirt = skirtMeshRef.current;
    const bodice = bodiceMeshRef.current;

    if (surfaceMode === 'wireframe') {
      (skirt.material as THREE.MeshStandardMaterial).wireframe = true;
      (bodice.material as THREE.MeshStandardMaterial).wireframe = true;
      (skirt.material as THREE.MeshStandardMaterial).color.set('#38bdf8');
      (bodice.material as THREE.MeshStandardMaterial).color.set('#0284c7');
    } else if (surfaceMode === 'stressMap') {
      // High-tension red at bust/waist, green optimum fit, blue loose hem
      (skirt.material as THREE.MeshStandardMaterial).wireframe = false;
      (bodice.material as THREE.MeshStandardMaterial).wireframe = false;
      (skirt.material as THREE.MeshStandardMaterial).color.set('#22c55e'); // Green optimum
      (bodice.material as THREE.MeshStandardMaterial).color.set('#f59e0b'); // Amber snug
    } else if (surfaceMode === 'translucent') {
      (skirt.material as THREE.MeshStandardMaterial).wireframe = false;
      (bodice.material as THREE.MeshStandardMaterial).wireframe = false;
      (skirt.material as THREE.MeshStandardMaterial).transparent = true;
      (skirt.material as THREE.MeshStandardMaterial).opacity = 0.5;
      (bodice.material as THREE.MeshStandardMaterial).transparent = true;
      (bodice.material as THREE.MeshStandardMaterial).opacity = 0.5;
    } else {
      // Default Textured
      (skirt.material as THREE.MeshStandardMaterial).wireframe = false;
      (bodice.material as THREE.MeshStandardMaterial).wireframe = false;
      (skirt.material as THREE.MeshStandardMaterial).transparent = false;
      (skirt.material as THREE.MeshStandardMaterial).opacity = 1.0;
      (bodice.material as THREE.MeshStandardMaterial).transparent = false;
      (bodice.material as THREE.MeshStandardMaterial).opacity = 1.0;
      (skirt.material as THREE.MeshStandardMaterial).color.set('#f8fafc');
      (bodice.material as THREE.MeshStandardMaterial).color.set(activeFabric.color);
    }
  }, [surfaceMode, activeFabric.color]);

  // Update Avatar & Garment Visibility
  useEffect(() => {
    if (avatarGroupRef.current) {
      avatarGroupRef.current.visible = avatarVisible;
    }
    if (skirtMeshRef.current) {
      skirtMeshRef.current.visible = garmentVisible;
    }
    if (bodiceMeshRef.current) {
      bodiceMeshRef.current.visible = garmentVisible;
    }
  }, [avatarVisible, garmentVisible]);

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
