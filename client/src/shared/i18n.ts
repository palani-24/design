import { Language } from './types';

export const translations = {
  en: {
    // Top Bar
    appTitle: 'CLO Standalone OnlineAuth Academic',
    subtitle: 'High-Precision 3D Fashion Design & Physics Engine',
    helloUser: 'Hello, xzhen1175',
    simulation: 'SIMULATION',
    simulationActive: 'SIMULATION RUNNING',
    simulationPaused: 'SIMULATION PAUSED',
    spacebarHint: 'Spacebar to toggle',
    language: 'Language',
    studioMode: 'Studio Mode',
    cloMode: 'CLO 3D Studio',
    tukaMode: 'TUKAcad 2D Studio',
    dualSplit: 'Split (3D + 2D)',
    view3DOnly: '3D Only',
    view2DOnly: '2D Only',

    // Left Tabs & Library
    history: 'HISTORY',
    modularConfig: 'MODULAR CONFIGURATOR',
    library: 'Library',
    garment: 'Garment',
    avatar: 'Avatar',
    hanger: 'Hanger',
    fabric: 'Fabric',
    hardwareTrims: 'Hardware and Trims',
    material: 'Material',
    stage: 'Stage',

    // Poses
    poseAPose: 'FV2_01_A.pos (Standard A-Pose)',
    poseAforsize: 'FV2_02_Aforsize.pos (Fitted Silhouette)',
    poseAttention: 'FV2_03_Attention.pos (Runway Straight)',
    poseRunning: 'FV2_08_Running.pos (Dynamic Motion)',
    poseSitting: 'FV2_09_Sitting.pos (Relaxed Chair)',
    poseArmsUp: 'FV2_10_ArmsUp.pos (Fit Range Test)',
    poseFrontArmRaise: 'FV2_11_FrontArmRaise.pos',

    // 3D Viewport
    bodiceProject: 'bodice_export.zprj',
    drapeMesh: '3D Mesh Drape',
    textured: 'Textured Surface',
    wireframe: 'Wireframe Mesh',
    stressMap: 'Tension & Stress Map',
    translucent: 'Translucent Drape',
    windBreeze: 'Wind / Breeze Dynamics',
    resetDrape: 'Reset 3D Drape',
    cameraPresets: 'Camera Angles',
    frontView: 'Front (2)',
    backView: 'Back (8)',
    sideView: 'Side (4)',
    topView: 'Top (5)',

    // 2D Pattern Window
    patternWindow: '2D Pattern Window',
    bodiceFront: 'Bodice Front (Cyan Cropped)',
    bodiceBack: 'Bodice Back Panel',
    skirtFront: 'A-Line Flared Skirt Front',
    skirtBack: 'A-Line Flared Skirt Back',
    seamLinks: 'Seam Sewing Connections',
    waistJoin: 'Waist Joining Seam',
    sideSeam: 'Side Fitting Seam',
    shoulderSeam: 'Shoulder Seam',

    // Right Panels
    objectBrowser: 'OBJECT BROWSER',
    propertyEditor: 'PROPERTY EDITOR',
    physicalProperties: 'Physical Fabric Properties',
    stretchWarp: 'Stretch Warp (%)',
    stretchWeft: 'Stretch Weft (%)',
    bending: 'Bending Rigidity (%)',
    shear: 'Shear Modulus (%)',
    density: 'Fabric Density (g/m²)',
    thickness: 'Thickness (mm)',
    friction: 'Surface Friction',
    colorPicker: 'Fabric Surface Color',

    // Status
    fps: 'FPS',
    vertices: 'Vertices',
    controlsHint: 'Left-drag to Orbit | Right-drag to Pan | Scroll to Zoom | Spacebar to Simulate',
    saveProject: 'Save Project',
    exportGltf: 'Export 3D GLTF / OBJ',
  },
  ta: {
    // Top Bar
    appTitle: 'CLO Standalone OnlineAuth Academic',
    subtitle: 'உயர் துல்லிய 3D ஆடை வடிவமைப்பு மற்றும் இயற்பியல் எஞ்சின்',
    helloUser: 'வணக்கம், xzhen1175',
    simulation: 'சிமுலேஷன்',
    simulationActive: 'சிமுலேஷன் இயங்குகிறது',
    simulationPaused: 'சிமுலேஷன் நிறுத்தப்பட்டுள்ளது',
    spacebarHint: 'Spacebar அழுத்தி இயக்கவும்',
    language: 'மொழி',
    studioMode: 'ஸ்டுடியோ பயன்முறை',
    cloMode: 'CLO 3D ஸ்டுடியோ',
    tukaMode: 'TUKAcad 2D ஸ்டுடியோ',
    dualSplit: 'இருபக்க பார்வை (3D + 2D)',
    view3DOnly: '3D மட்டும்',
    view2DOnly: '2D மட்டும்',

    // Left Tabs & Library
    history: 'வரலாறு (History)',
    modularConfig: 'மாடுலர் உள்ளமைப்பான்',
    library: 'ஆடை நூலகம் (Library)',
    garment: 'ஆடைகள் (Garment)',
    avatar: 'அவதார் பொம்மை (Avatar)',
    hanger: 'ஆடை மாட்டி (Hanger)',
    fabric: 'துணி வகைகள் (Fabric)',
    hardwareTrims: 'பொத்தான்கள் & ஜிப்கள்',
    material: 'பொருட்கள் (Material)',
    stage: 'மேடை & வெளிச்சம் (Stage)',

    // Poses
    poseAPose: 'FV2_01_A.pos (வழக்கமான A-நிலை)',
    poseAforsize: 'FV2_02_Aforsize.pos (பொருத்தமான உடல்நிலை)',
    poseAttention: 'FV2_03_Attention.pos (நேரான நடைமேடை நிலை)',
    poseRunning: 'FV2_08_Running.pos (ஓடும் நிலை இயக்கம்)',
    poseSitting: 'FV2_09_Sitting.pos (அமர்ந்த நிலை)',
    poseArmsUp: 'FV2_10_ArmsUp.pos (கைகள் உயர்த்திய நிலை)',
    poseFrontArmRaise: 'FV2_11_FrontArmRaise.pos (முன்கை நிலை)',

    // 3D Viewport
    bodiceProject: 'bodice_export.zprj',
    drapeMesh: '3D துணி அமைப்பு',
    textured: 'துணி அமைப்பு தோற்றம்',
    wireframe: 'கம்பளி வலை (Wireframe)',
    stressMap: 'இழுவிசை வெப்ப வரைபடம் (Stress Map)',
    translucent: 'ஒளிரும் ஊடுருவல் தோற்றம்',
    windBreeze: 'காற்றலை இயக்கம் (Wind)',
    resetDrape: 'துணி அமைப்பை மீட்டமை',
    cameraPresets: 'கேமரா கோணங்கள்',
    frontView: 'முன்புறம் (2)',
    backView: 'பின்புறம் (8)',
    sideView: 'பக்கவாட்டு (4)',
    topView: 'மேற்புறம் (5)',

    // 2D Pattern Window
    patternWindow: '2D பேட்டர்ன் சாளரம்',
    bodiceFront: 'போடிஸ் முன் பகுதி (Crop Top)',
    bodiceBack: 'போடிஸ் பின் பகுதி',
    skirtFront: 'A-Line பாவாடை முன் பகுதி',
    skirtBack: 'A-Line பாவாடை பின் பகுதி',
    seamLinks: 'தையல் இணைப்புகள் (Seam Links)',
    waistJoin: 'இடுப்பு தையல் இணைப்பு',
    sideSeam: 'பக்கவாட்டு தையல்',
    shoulderSeam: 'தோள்பட்டை தையல்',

    // Right Panels
    objectBrowser: 'பொருட்கள் உலாவி (Browser)',
    propertyEditor: 'பண்புகள் திருத்தி (Editor)',
    physicalProperties: 'துணியின் இயற்பியல் பண்புகள்',
    stretchWarp: 'நீளம் நீட்சி (Warp %)',
    stretchWeft: 'அகலம் நீட்சி (Weft %)',
    bending: 'வளையும் தன்மை (Bending %)',
    shear: 'கத்திரிப்பு மாடுலஸ் (Shear %)',
    density: 'துணி அடர்த்தி (g/m²)',
    thickness: 'தடிமன் (Thickness mm)',
    friction: 'மேற்பரப்பு உராய்வு',
    colorPicker: 'துணி நிறம் தேர்வு',

    // Status
    fps: 'பிரேம்கள்/விநாடி (FPS)',
    vertices: 'முனைகள் (Vertices)',
    controlsHint: 'இடதுகிளிக்: சுழற்ற | வலதுகிளிக்: நகர்த்த | Scroll: பெரிதாக்க | Spacebar: சிமுலேஷன்',
    saveProject: 'திட்டத்தை சேமி',
    exportGltf: '3D கோப்பாக ஏற்றுமதி (GLTF/OBJ)',
  },
};

export const getTranslation = (lang: Language, key: keyof typeof translations['en']): string => {
  return translations[lang][key] || translations['en'][key] || key;
};
