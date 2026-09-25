import * as THREE from "three";
import { defaultMaterial, uid, type BakedGeom, type StudioObject, type Triple } from "./types";
import { useStudio } from "./store";
import { formatLoadError, resolveAssetUrl, storeFileAsIdb } from "./asset-db";

export const IMPORT_ACCEPT = [
  ".glb",
  ".gltf",
  ".fbx",
  ".obj",
  ".mtl",
  ".stl",
  ".ply",
  ".dae",
  ".3ds",
  ".3mf",
  ".vtk",
  ".vtp",
  ".xyz",
  ".pcd",
  ".wrl",
  ".usdz",
  ".hdr",
  ".exr",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".json",
  ".bin",
].join(",");

export interface LoadedAsset {
  root: THREE.Object3D;
  clips: THREE.AnimationClip[];
  format: string;
}

const cache = new Map<string, Promise<LoadedAsset>>();
let lastMtl: { preload: () => void } | null = null;

function extOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function dirOf(url: string) {
  if (url.startsWith("blob:") || url.startsWith("idb:")) return "";
  const i = url.lastIndexOf("/");
  return i >= 0 ? url.slice(0, i + 1) : "";
}

let gltfReady: Promise<import("three/addons/loaders/GLTFLoader.js").GLTFLoader> | null = null;

async function getGltfLoader() {
  if (!gltfReady) {
    gltfReady = (async () => {
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js");
      const { KTX2Loader } = await import("three/addons/loaders/KTX2Loader.js");
      const { MeshoptDecoder } = await import("three/addons/libs/meshopt_decoder.module.js");
      const draco = new DRACOLoader();
      draco.setDecoderPath("/decoders/draco/gltf/");
      const ktx2 = new KTX2Loader();
      ktx2.setTranscoderPath("/decoders/basis/");
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        if (gl) {
          const renderer = new THREE.WebGLRenderer({ canvas, context: gl as WebGLRenderingContext });
          ktx2.detectSupport(renderer);
          renderer.dispose();
        }
      } catch {
        /* optional */
      }
      const loader = new GLTFLoader();
      loader.setDRACOLoader(draco);
      loader.setKTX2Loader(ktx2);
      const decoder = MeshoptDecoder as { supported?: boolean; ready?: Promise<unknown> };
      if (decoder.supported !== false) {
        if (decoder.ready) await decoder.ready;
        loader.setMeshoptDecoder(MeshoptDecoder);
      }
      return loader;
    })();
  }
  return gltfReady;
}

export async function loadRuntime(url: string, format: string): Promise<LoadedAsset> {
  const resolved = await resolveAssetUrl(url);
  const key = `${format}|${resolved}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const p = loadRuntimeUncached(resolved, format);
  cache.set(key, p);
  try {
    return await p;
  } catch (err) {
    cache.delete(key);
    throw err;
  }
}

async function loadRuntimeUncached(url: string, format: string): Promise<LoadedAsset> {
  const fmt = format.replace(/^\./, "").toLowerCase();
  if (fmt === "glb" || fmt === "gltf") {
    const loader = await getGltfLoader();
    const gltf = await loader.loadAsync(url);
    return { root: gltf.scene, clips: gltf.animations ?? [], format: fmt };
  }
  if (fmt === "fbx") {
    const { FBXLoader } = await import("three/addons/loaders/FBXLoader.js");
    const loader = new FBXLoader();
    const resource = dirOf(url);
    if (resource) loader.setResourcePath(resource);
    const group = await loader.loadAsync(url);
    return { root: group, clips: group.animations ?? [], format: "fbx" };
  }
  if (fmt === "obj") {
    const { OBJLoader } = await import("three/addons/loaders/OBJLoader.js");
    const loader = new OBJLoader();
    if (lastMtl) loader.setMaterials(lastMtl as never);
    const group = await loader.loadAsync(url);
    return { root: group, clips: [], format: "obj" };
  }
  if (fmt === "stl") {
    const { STLLoader } = await import("three/addons/loaders/STLLoader.js");
    const geo = await new STLLoader().loadAsync(url);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ color: 0xc5c6ca, metalness: 0.1, roughness: 0.5 }),
    );
    return { root: mesh, clips: [], format: "stl" };
  }
  if (fmt === "ply") {
    const { PLYLoader } = await import("three/addons/loaders/PLYLoader.js");
    const geo = await new PLYLoader().loadAsync(url);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ vertexColors: Boolean(geo.getAttribute("color")) }),
    );
    return { root: mesh, clips: [], format: "ply" };
  }
  if (fmt === "dae") {
    const { ColladaLoader } = await import("three/addons/loaders/ColladaLoader.js");
    const collada = await new ColladaLoader().loadAsync(url);
    if (!collada?.scene) throw new Error("Empty Collada");
    return { root: collada.scene, clips: [], format: "dae" };
  }
  if (fmt === "3ds") {
    const { TDSLoader } = await import("three/addons/loaders/TDSLoader.js");
    const obj = await new TDSLoader().loadAsync(url);
    return { root: obj, clips: [], format: "3ds" };
  }
  if (fmt === "3mf") {
    const { ThreeMFLoader } = await import("three/addons/loaders/3MFLoader.js");
    const obj = await new ThreeMFLoader().loadAsync(url);
    return { root: obj, clips: [], format: "3mf" };
  }
  if (fmt === "vtk" || fmt === "vtp") {
    const { VTKLoader } = await import("three/addons/loaders/VTKLoader.js");
    const geo = await new VTKLoader().loadAsync(url);
    geo.computeVertexNormals();
    return { root: new THREE.Mesh(geo, new THREE.MeshStandardMaterial()), clips: [], format: "vtk" };
  }
  if (fmt === "xyz") {
    const { XYZLoader } = await import("three/addons/loaders/XYZLoader.js");
    const geo = await new XYZLoader().loadAsync(url);
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.04, color: 0xe07820 }));
    return { root: pts, clips: [], format: "xyz" };
  }
  if (fmt === "pcd") {
    const { PCDLoader } = await import("three/addons/loaders/PCDLoader.js");
    const pts = await new PCDLoader().loadAsync(url);
    return { root: pts, clips: [], format: "pcd" };
  }
  if (fmt === "wrl") {
    const { VRMLLoader } = await import("three/addons/loaders/VRMLLoader.js");
    const obj = await new VRMLLoader().loadAsync(url);
    return { root: obj, clips: [], format: "wrl" };
  }
  if (fmt === "usdz") {
    const { USDZLoader } = await import("three/addons/loaders/USDZLoader.js");
    const obj = await new USDZLoader().loadAsync(url);
    return { root: obj, clips: [], format: "usdz" };
  }
  if (fmt === "svg") {
    const { SVGLoader } = await import("three/addons/loaders/SVGLoader.js");
    const data = await new SVGLoader().loadAsync(url);
    const g = new THREE.Group();
    for (const p of data.paths) {
      const shapes = SVGLoader.createShapes(p);
      for (const shape of shapes) {
        const mesh = new THREE.Mesh(
          new THREE.ExtrudeGeometry(shape, { depth: 8, bevelEnabled: false }),
          new THREE.MeshStandardMaterial({ color: p.color }),
        );
        g.add(mesh);
      }
    }
    g.scale.set(0.01, -0.01, 0.01);
    return { root: g, clips: [], format: "svg" };
  }
  throw new Error(`Unsupported format: ${fmt}`);
}

function meshToBaked(mesh: THREE.Mesh, name: string): StudioObject | null {
  const geo = (mesh.geometry as THREE.BufferGeometry).clone();
  geo.applyMatrix4(mesh.matrixWorld);
  const pos = geo.getAttribute("position");
  if (!pos) return null;
  const nrm = geo.getAttribute("normal");
  const uv = geo.getAttribute("uv");
  const baked: BakedGeom = {
    position: Array.from(pos.array as Float32Array),
    normal: nrm ? Array.from(nrm.array as Float32Array) : undefined,
    index: geo.index ? (Array.from(geo.index.array as ArrayLike<number>) as number[]) : undefined,
    uv: uv ? Array.from(uv.array as Float32Array) : undefined,
  };
  const world = new THREE.Vector3();
  mesh.getWorldPosition(world);
  const color =
    mesh.material && !Array.isArray(mesh.material) && "color" in mesh.material
      ? "#" + (mesh.material as THREE.MeshStandardMaterial).color.getHexString()
      : "#c5c6ca";
  return {
    id: uid("im"),
    name: mesh.name || name,
    kind: "mesh",
    visible: true,
    position: [world.x, world.y, world.z],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    primitive: "baked",
    params: {},
    material: { ...defaultMaterial(mesh.name || "Imported", color) },
    cameraFov: 45,
    modifiers: [],
    keyframes: [],
    baked,
  };
}

function fitAssetScale(root: THREE.Object3D, format: string): Triple {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(maxDim) || maxDim <= 0) {
    return format === "fbx" ? [0.012, 0.012, 0.012] : [1, 1, 1];
  }
  if (maxDim > 8 || maxDim < 0.35) {
    const s = 1.75 / maxDim;
    return [s, s, s];
  }
  return [1, 1, 1];
}

function makeAssetObject(name: string, url: string, format: string, clips: string[], scale?: Triple): StudioObject {
  return {
    id: uid("as"),
    name,
    kind: "asset",
    visible: true,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: scale ?? (format === "fbx" ? [0.012, 0.012, 0.012] : [1, 1, 1]),
    primitive: "asset",
    params: {},
    material: defaultMaterial(name),
    cameraFov: 45,
    modifiers: [],
    keyframes: [],
    assetUrl: url,
    assetFormat: format,
    clips,
    clipName: clips[0],
    clipSpeed: 1,
    assetMissing: false,
  };
}

export async function importAnyFile(file: File) {
  const fmt = extOf(file.name);
  const st = useStudio.getState();
  const fail = (err: unknown) => {
    const msg = formatLoadError(err, file.name, st.lang);
    st.log({ kind: "err", text: msg });
    throw new Error(msg);
  };

  if (fmt === "json") {
    const text = await file.text();
    const data = JSON.parse(text) as {
      objects?: StudioObject[];
      lang?: "fa" | "en";
      envPreset?: string;
      pythonCode?: string;
      shading?: string;
    };
    if (!Array.isArray(data.objects)) throw new Error("Invalid project");
    useStudio.getState().hydrate({
      objects: data.objects,
      lang: data.lang,
      pythonCode: data.pythonCode,
      envPreset: data.envPreset as never,
      shading: data.shading as never,
    });
    useStudio.getState().setShowWelcome(false);
    return;
  }

  if (["png", "jpg", "jpeg", "webp"].includes(fmt)) {
    const id = st.activeId;
    if (!id) {
      throw new Error(st.lang === "fa" ? "ابتدا یک مش انتخاب کنید تا بافت اعمال شود" : "Select a mesh to apply the texture");
    }
    const url = await storeFileAsIdb(file, file.name, file.type);
    st.patchMaterial(id, { mapUrl: url });
    return;
  }

  if (fmt === "hdr" || fmt === "exr") {
    const url = await storeFileAsIdb(file, file.name, file.type);
    const resolved = await resolveAssetUrl(url);
    const { RGBELoader } = await import("three/addons/loaders/RGBELoader.js");
    const { EXRLoader } = await import("three/addons/loaders/EXRLoader.js");
    const loader = fmt === "hdr" ? new RGBELoader() : new EXRLoader();
    const tex = await loader.loadAsync(resolved);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    st.log({ kind: "info", text: `HDRI loaded: ${file.name}` });
    st.setEnv("studio");
    (globalThis as unknown as { __zynyxHdr?: THREE.DataTexture }).__zynyxHdr = tex as THREE.DataTexture;
    return;
  }

  if (fmt === "mtl") {
    const text = await file.text();
    const { MTLLoader } = await import("three/addons/loaders/MTLLoader.js");
    const creator = new MTLLoader().parse(text, "");
    creator.preload();
    lastMtl = creator;
    st.log({
      kind: "info",
      text: st.lang === "fa" ? `MTL آماده شد: ${file.name} — حالا OBJ را ایمپورت کنید` : `MTL ready: ${file.name} — import the OBJ next`,
    });
    return;
  }

  const keepRig = ["glb", "gltf", "fbx", "dae", "usdz"].includes(fmt);
  const stored = await storeFileAsIdb(file, file.name, file.type);

  try {
    const loaded = await loadRuntime(stored, fmt);
    if (keepRig) {
      const clips = loaded.clips.map((c) => c.name || "clip");
      const obj = makeAssetObject(
        file.name.replace(/\.[^.]+$/, ""),
        stored,
        fmt,
        clips,
        fitAssetScale(loaded.root, fmt),
      );
      st.appendObjects([obj], obj.id);
      if (clips.length) {
        const dur = loaded.clips[0]?.duration ?? 0;
        if (dur > 0) st.setFrameRange(1, Math.max(st.frameEnd, Math.ceil(dur * st.fps) + 1));
        st.setPlaying(true);
        st.setLayout("anim");
      }
      return;
    }

    loaded.root.updateMatrixWorld(true);
    const added: StudioObject[] = [];
    loaded.root.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        const baked = meshToBaked(mesh, file.name.replace(/\.[^.]+$/, ""));
        if (baked) added.push(baked);
      }
    });
    if (!added.length) {
      const obj = makeAssetObject(
        file.name.replace(/\.[^.]+$/, ""),
        stored,
        fmt,
        [],
        fitAssetScale(loaded.root, fmt),
      );
      st.appendObjects([obj], obj.id);
      return;
    }
    st.appendObjects(added, added[0]?.id ?? null);
  } catch (err) {
    fail(err);
  }
}

export async function importFromUrl(url: string, format: string, name: string) {
  const loaded = await loadRuntime(url, format);
  const clips = loaded.clips.map((c) => c.name || "clip");
  const obj = makeAssetObject(name, url, format, clips, fitAssetScale(loaded.root, format));
  const st = useStudio.getState();
  st.appendObjects([obj], obj.id);
  if (clips.length) {
    const dur = loaded.clips[0]?.duration ?? 0;
    if (dur > 0) st.setFrameRange(1, Math.max(st.frameEnd, Math.ceil(dur * st.fps) + 1));
    st.setPlaying(true);
  }
  return obj.id;
}
