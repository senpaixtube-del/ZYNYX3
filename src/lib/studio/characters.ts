import { defaultMaterial, uid, type StudioObject, type Triple } from "./types";

const THREEJS = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r170/examples/models";

export interface SampleCharacter {
  id: string;
  nameFa: string;
  nameEn: string;
  format: string;
  url: string;
  scale: Triple;
  position: Triple;
  clip?: string;
  tag: string;
}

export const SAMPLE_CHARACTERS: SampleCharacter[] = [
  {
    id: "soldier",
    nameFa: "سرباز",
    nameEn: "Soldier",
    format: "glb",
    url: `${THREEJS}/gltf/Soldier.glb`,
    scale: [1.35, 1.35, 1.35],
    position: [0, 0, 0],
    clip: "Walk",
    tag: "GLB · Walk/Run/Idle",
  },
  {
    id: "xbot",
    nameFa: "ایکس‌بات",
    nameEn: "X Bot",
    format: "glb",
    url: `${THREEJS}/gltf/Xbot.glb`,
    scale: [1.15, 1.15, 1.15],
    position: [0, 0, 0],
    tag: "GLB · اسکلت کامل",
  },
  {
    id: "robot",
    nameFa: "ربات بیانی",
    nameEn: "Expressive Robot",
    format: "glb",
    url: `${THREEJS}/gltf/RobotExpressive/RobotExpressive.glb`,
    scale: [0.55, 0.55, 0.55],
    position: [0, 0, 0],
    clip: "Walking",
    tag: "GLB · ۱۲ کلیپ",
  },
  {
    id: "samba",
    nameFa: "رقاص سامبا",
    nameEn: "Samba Dancer",
    format: "fbx",
    url: `${THREEJS}/fbx/Samba%20Dancing.fbx`,
    scale: [0.012, 0.012, 0.012],
    position: [0, 0, 0],
    tag: "FBX · Mixamo",
  },
  {
    id: "horse",
    nameFa: "اسب",
    nameEn: "Horse",
    format: "glb",
    url: `${THREEJS}/gltf/Horse.glb`,
    scale: [0.012, 0.012, 0.012],
    position: [0, 0, 0],
    tag: "GLB · دویدن",
  },
  {
    id: "flamingo",
    nameFa: "فلامینگو",
    nameEn: "Flamingo",
    format: "glb",
    url: `${THREEJS}/gltf/Flamingo.glb`,
    scale: [0.018, 0.018, 0.018],
    position: [0, 1.1, 0],
    tag: "GLB · پرواز",
  },
  {
    id: "parrot",
    nameFa: "طوطی",
    nameEn: "Parrot",
    format: "glb",
    url: `${THREEJS}/gltf/Parrot.glb`,
    scale: [0.04, 0.04, 0.04],
    position: [0, 1.4, 0],
    tag: "GLB · بال زدن",
  },
  {
    id: "stork",
    nameFa: "لک‌لک",
    nameEn: "Stork",
    format: "glb",
    url: `${THREEJS}/gltf/Stork.glb`,
    scale: [0.028, 0.028, 0.028],
    position: [0, 1.2, 0],
    tag: "GLB · پرواز",
  },
];

export function assetFromSample(sample: SampleCharacter, extra?: Partial<StudioObject>): StudioObject {
  return {
    id: uid("ch"),
    name: sample.nameEn,
    kind: "asset",
    visible: true,
    position: extra?.position ?? sample.position,
    rotation: extra?.rotation ?? [0, 0, 0],
    scale: extra?.scale ?? sample.scale,
    primitive: "asset",
    params: { sampleId: sample.id },
    material: defaultMaterial(sample.nameEn),
    cameraFov: 45,
    modifiers: [],
    keyframes: extra?.keyframes ?? [],
    assetUrl: sample.url,
    assetFormat: sample.format,
    clipName: sample.clip,
    clipSpeed: 1,
    clips: [],
    ...omitPos(extra),
  };
}

function omitPos(extra?: Partial<StudioObject>): Partial<StudioObject> {
  if (!extra) return {};
  const { position: _p, rotation: _r, scale: _s, keyframes: _k, ...rest } = extra;
  return rest;
}

function part(
  name: string,
  primitive: StudioObject["primitive"],
  position: Triple,
  scale: Triple,
  color: string,
  parentId?: string,
  extra?: Partial<StudioObject>,
): StudioObject {
  return {
    id: uid("mn"),
    name,
    kind: "mesh",
    visible: true,
    position,
    rotation: extra?.rotation ?? [0, 0, 0],
    scale,
    primitive,
    params: extra?.params ?? {},
    material: { ...defaultMaterial(name, color), roughness: 0.48, sheen: 0.2 },
    cameraFov: 45,
    modifiers: [],
    keyframes: extra?.keyframes ?? [],
    parentId,
  };
}

function walkKeys(base: Triple, axis: 0 | 1 | 2, amp: number, frames = 24): StudioObject["keyframes"] {
  const keys: StudioObject["keyframes"] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const frame = 1 + Math.round(t * (frames - 1));
    const rot: Triple = [0, 0, 0];
    rot[axis] = Math.sin(t * Math.PI * 2) * amp;
    keys.push({ frame, position: [...base], rotation: rot, scale: [1, 1, 1] });
  }
  return keys;
}

/** Local mannequin — always available even without network. */
export function buildMannequin(opts: {
  name: string;
  color: string;
  accent: string;
  x: number;
  bounce?: boolean;
}): StudioObject[] {
  const { name, color, accent, x, bounce } = opts;
  const hips = part(`${name}.Hips`, "cube", [x, 0.95, 0], [0.28, 0.12, 0.16], color);
  const torso = part(`${name}.Torso`, "rounded", [0, 0.42, 0], [0.42, 0.55, 0.28], color, hips.id);
  const head = part(`${name}.Head`, "sphere", [0, 0.55, 0], [0.22, 0.26, 0.22], accent, torso.id, {
    keyframes: bounce
      ? [
          { frame: 1, position: [0, 0.55, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
          { frame: 12, position: [0, 0.62, 0], rotation: [0, 0.4, 0], scale: [1, 1, 1] },
          { frame: 24, position: [0, 0.55, 0], rotation: [0, 0.8, 0], scale: [1, 1, 1] },
        ]
      : walkKeys([0, 0.55, 0], 1, 0.18),
  });
  const armL = part(`${name}.Arm.L`, "capsule", [-0.38, 0.18, 0], [0.1, 0.42, 0.1], color, torso.id, {
    keyframes: walkKeys([-0.38, 0.18, 0], 0, 0.7),
    params: { radius: 0.5, depth: 1 },
  });
  const armR = part(`${name}.Arm.R`, "capsule", [0.38, 0.18, 0], [0.1, 0.42, 0.1], color, torso.id, {
    keyframes: walkKeys([0.38, 0.18, 0], 0, -0.7),
  });
  const legL = part(`${name}.Leg.L`, "capsule", [-0.12, -0.55, 0], [0.12, 0.55, 0.12], color, hips.id, {
    keyframes: walkKeys([-0.12, -0.55, 0], 0, -0.55),
  });
  const legR = part(`${name}.Leg.R`, "capsule", [0.12, -0.55, 0], [0.12, 0.55, 0.12], color, hips.id, {
    keyframes: walkKeys([0.12, -0.55, 0], 0, 0.55),
  });
  hips.keyframes = bounce
    ? [
        { frame: 1, position: [x, 0.95, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        { frame: 12, position: [x, 1.08, 0], rotation: [0, Math.PI, 0], scale: [1, 1, 1] },
        { frame: 24, position: [x, 0.95, 0], rotation: [0, Math.PI * 2, 0], scale: [1, 1, 1] },
      ]
    : [
        { frame: 1, position: [x, 0.95, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        { frame: 12, position: [x, 1.02, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
        { frame: 24, position: [x, 0.95, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
      ];
  return [hips, torso, head, armL, armR, legL, legR];
}

export function mannequinPack(): StudioObject[] {
  return [
    ...buildMannequin({ name: "Hero", color: "#c99578", accent: "#e8c4a8", x: -2.2 }),
    ...buildMannequin({ name: "Knight", color: "#6b7280", accent: "#d4a017", x: 0, bounce: true }),
    ...buildMannequin({ name: "Android", color: "#3d7ea6", accent: "#e07820", x: 2.2 }),
  ];
}
