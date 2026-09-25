import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Html,
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
  Text,
} from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { registerCapture } from "@/lib/studio/viewport-api";
import { evaluateGeometry, geometrySignature } from "@/lib/studio/geometry";
import { evalObjectAtFrame, useStudio } from "@/lib/studio/store";
import { captureRender } from "@/lib/studio/export";
import { formatLoadError, resolveAssetUrl } from "@/lib/studio/asset-db";
import { loadRuntime } from "@/lib/studio/importers";
import { t } from "@/lib/studio/i18n";
import type { StudioObject } from "@/lib/studio/types";
import { toast } from "sonner";
import { clone as cloneSkinned } from "three/addons/utils/SkeletonUtils.js";

RectAreaLightUniformsLib.init();

function worldOf(obj: StudioObject, frame: number): { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] } {
  const live = evalObjectAtFrame(obj, frame);
  if (!obj.parentId) return live;
  const parent = useStudio.getState().objects.find((o) => o.id === obj.parentId);
  if (!parent) return live;
  const p = evalObjectAtFrame(parent, frame);
  return {
    position: [live.position[0] + p.position[0], live.position[1] + p.position[1], live.position[2] + p.position[2]],
    rotation: [live.rotation[0] + p.rotation[0], live.rotation[1] + p.rotation[1], live.rotation[2] + p.rotation[2]],
    scale: [live.scale[0] * p.scale[0], live.scale[1] * p.scale[1], live.scale[2] * p.scale[2]],
  };
}

function useLive(obj: StudioObject) {
  const frame = useStudio((s) => s.frame);
  const live = worldOf(obj, frame);
  const dragging = useStudio((s) => s.transformDragging && s.activeId === obj.id);
  if (dragging) {
    return {
      position: undefined as unknown as [number, number, number],
      rotation: undefined as unknown as [number, number, number],
      scale: undefined as unknown as [number, number, number],
      skip: true,
    };
  }
  return { ...live, skip: false };
}

function StudioMesh({ obj, selected }: { obj: StudioObject; selected: boolean }) {
  const shading = useStudio((s) => s.shading);
  const sig = geometrySignature(obj);
  const geo = useMemo(() => evaluateGeometry(obj), [obj, sig]);
  useEffect(() => () => geo.dispose(), [geo]);
  const live = useLive(obj);
  const mat = obj.material;
  const [map, setMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!mat.mapUrl) {
      setMap(null);
      return;
    }
    let dead = false;
    const loader = new THREE.TextureLoader();
    void resolveAssetUrl(mat.mapUrl)
      .then(
        (url) =>
          new Promise<THREE.Texture>((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
          }),
      )
      .then((tex) => {
        if (dead) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        setMap(tex);
      })
      .catch(() => {
        if (!dead) setMap(null);
      });
    return () => {
      dead = true;
    };
  }, [mat.mapUrl]);
  useEffect(() => () => map?.dispose(), [map]);
  const common = {
    color: mat.color,
    roughness: mat.roughness,
    metalness: mat.metalness,
    emissive: mat.emissive,
    emissiveIntensity: mat.emissiveIntensity,
    wireframe: shading === "wire" || mat.wireframe,
    flatShading: mat.flat,
    transparent: mat.opacity < 0.999 || mat.transmission > 0.01,
    opacity: mat.opacity,
    side: THREE.DoubleSide,
    map: map ?? undefined,
  } as const;

  const material =
    shading === "wire" ? (
      <meshBasicMaterial color={selected ? "#e07820" : "#9aa0a8"} wireframe />
    ) : shading === "solid" ? (
      <meshLambertMaterial color={mat.color} wireframe={mat.wireframe} flatShading={mat.flat} map={map} />
    ) : (
      <meshPhysicalMaterial
        {...common}
        transmission={mat.transmission}
        thickness={mat.thickness}
        ior={mat.ior}
        clearcoat={mat.clearcoat}
        clearcoatRoughness={mat.clearcoatRoughness}
        envMapIntensity={mat.envMapIntensity}
        iridescence={mat.iridescence}
        sheen={mat.sheen}
        sheenRoughness={0.4}
      />
    );

  const isText = obj.primitive === "text";
  return (
    <group
      name={obj.id}
      position={live.skip ? undefined : live.position}
      rotation={live.skip ? undefined : live.rotation}
      scale={live.skip ? undefined : live.scale}
      visible={obj.visible}
      userData={{ id: obj.id }}
      onClick={(e) => {
        e.stopPropagation();
        useStudio.getState().select(obj.id, e.shiftKey);
      }}
    >
      {isText ? (
        <Text
          fontSize={Number(obj.params.size) || 0.55}
          color={mat.color}
          anchorX="center"
          anchorY="middle"
          depthOffset={-1}
        >
          {String(obj.params.text || "ZYNYX")}
        </Text>
      ) : (
        <mesh geometry={geo} castShadow receiveShadow>
          {material}
        </mesh>
      )}
      {selected && shading !== "wire" && (
        <mesh geometry={geo}>
          <meshBasicMaterial color="#e07820" wireframe transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

function LightNode({ obj, selected }: { obj: StudioObject; selected: boolean }) {
  const live = useLive(obj);
  const L = obj.light;
  if (!L) return null;
  const color = L.color;
  return (
    <group
      name={obj.id}
      position={live.skip ? undefined : live.position}
      rotation={live.skip ? undefined : live.rotation}
      visible={obj.visible}
      userData={{ id: obj.id }}
      onClick={(e) => {
        e.stopPropagation();
        useStudio.getState().select(obj.id, e.shiftKey);
      }}
    >
      {L.type === "sun" && (
        <directionalLight
          color={color}
          intensity={L.intensity}
          castShadow={L.castShadow}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
        />
      )}
      {L.type === "point" && (
        <pointLight color={color} intensity={L.intensity} distance={L.distance} castShadow={L.castShadow} />
      )}
      {L.type === "spot" && (
        <spotLight
          color={color}
          intensity={L.intensity}
          angle={L.angle}
          penumbra={0.35}
          distance={L.distance}
          castShadow={L.castShadow}
        />
      )}
      {L.type === "area" && (
        <rectAreaLight color={color} intensity={L.intensity} width={L.width} height={L.height} />
      )}
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color={selected ? "#e07820" : color} />
      </mesh>
    </group>
  );
}

function CameraNode({ obj, selected }: { obj: StudioObject; selected: boolean }) {
  const live = useLive(obj);
  return (
    <group
      name={obj.id}
      position={live.skip ? undefined : live.position}
      rotation={live.skip ? undefined : live.rotation}
      visible={obj.visible}
      userData={{ id: obj.id }}
      onClick={(e) => {
        e.stopPropagation();
        useStudio.getState().select(obj.id, e.shiftKey);
      }}
    >
      <mesh>
        <boxGeometry args={[0.28, 0.2, 0.4]} />
        <meshStandardMaterial color={selected ? "#e07820" : "#3a3c44"} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.14, 0.22, 12]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}

function EmptyNode({ obj, selected }: { obj: StudioObject; selected: boolean }) {
  const live = useLive(obj);
  return (
    <group
      name={obj.id}
      position={live.skip ? undefined : live.position}
      rotation={live.skip ? undefined : live.rotation}
      scale={live.skip ? undefined : live.scale}
      visible={obj.visible}
      userData={{ id: obj.id }}
      onClick={(e) => {
        e.stopPropagation();
        useStudio.getState().select(obj.id, e.shiftKey);
      }}
    >
      <axesHelper args={[0.6]} />
      {selected && (
        <mesh>
          <octahedronGeometry args={[0.1, 0]} />
          <meshBasicMaterial color="#e07820" />
        </mesh>
      )}
    </group>
  );
}

function AssetNode({ obj, selected }: { obj: StudioObject; selected: boolean }) {
  const live = useLive(obj);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const clipsRef = useRef<THREE.AnimationClip[]>([]);
  const [root, setRoot] = useState<THREE.Object3D | null>(null);
  const [failed, setFailed] = useState(false);
  const [errText, setErrText] = useState<string | null>(null);

  useEffect(() => {
    if (!obj.assetUrl || !obj.assetFormat) {
      setFailed(true);
      setRoot(null);
      setErrText(obj.loadError || t(useStudio.getState().lang, "reimport"));
      return;
    }
    let dead = false;
    setFailed(false);
    setErrText(null);
    loadRuntime(obj.assetUrl, obj.assetFormat)
      .then((loaded) => {
        if (dead) return;
        const clone = cloneSkinned(loaded.root);
        clone.traverse((n: THREE.Object3D) => {
          const mesh = n as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });
        mixer.current = new THREE.AnimationMixer(clone);
        clipsRef.current = loaded.clips;
        const names = loaded.clips.map((c) => c.name || "clip");
        const st = useStudio.getState();
        const cur = st.objects.find((o) => o.id === obj.id);
        const patch: Partial<StudioObject> = {};
        if (names.length && (!cur?.clips || cur.clips.join("\0") !== names.join("\0"))) patch.clips = names;
        if (names.length && !cur?.clipName) patch.clipName = names[0];
        if (cur?.assetMissing) patch.assetMissing = false;
        if (cur?.loadError) patch.loadError = undefined;
        if (Object.keys(patch).length) st.updateObject(obj.id, patch);
        setRoot(clone);
      })
      .catch((err) => {
        if (dead) return;
        const lang = useStudio.getState().lang;
        const msg = formatLoadError(err, obj.name, lang);
        setFailed(true);
        setErrText(msg);
        const st = useStudio.getState();
        const cur = st.objects.find((o) => o.id === obj.id);
        if (cur?.loadError !== msg) {
          st.updateObject(obj.id, { assetMissing: true, loadError: msg });
          st.log({ kind: "err", text: msg });
          toast.error(msg);
        }
      });
    return () => {
      dead = true;
      mixer.current?.stopAllAction();
      mixer.current = null;
      clipsRef.current = [];
    };
  }, [obj.assetUrl, obj.assetFormat, obj.id, obj.name]);

  useEffect(() => {
    const mix = mixer.current;
    if (!mix || !root) return;
    mix.stopAllAction();
    const pick = clipsRef.current.find((c) => c.name === obj.clipName) ?? clipsRef.current[0] ?? null;
    if (pick) {
      const action = mix.clipAction(pick);
      action.enabled = true;
      action.paused = false;
      action.play();
    }
  }, [obj.clipName, root]);

  useFrame(() => {
    const mix = mixer.current;
    const clip = clipsRef.current.find((c) => c.name === obj.clipName) ?? clipsRef.current[0];
    if (!mix || !clip) return;
    const s = useStudio.getState();
    const speed = obj.clipSpeed ?? 1;
    const dur = Math.max(0.001, clip.duration);
    const tSec = ((s.frame - s.frameStart) / Math.max(1, s.fps)) * speed;
    mix.setTime(((tSec % dur) + dur) % dur);
  });

  return (
    <group
      name={obj.id}
      position={live.skip ? undefined : live.position}
      rotation={live.skip ? undefined : live.rotation}
      scale={live.skip ? undefined : live.scale}
      visible={obj.visible}
      userData={{ id: obj.id }}
      onClick={(e) => {
        e.stopPropagation();
        useStudio.getState().select(obj.id, e.shiftKey);
      }}
    >
      {root ? (
        <primitive object={root} />
      ) : (
        <mesh>
          <capsuleGeometry args={[0.2, 1.1, 6, 12]} />
          <meshStandardMaterial color={failed ? "#d4524a" : "#e07820"} wireframe />
        </mesh>
      )}
      {failed && errText && (
        <Html center>
          <div className="max-w-48 rounded-sm bg-bg-elevated/90 px-2 py-1 text-center text-2xs text-danger">
            {errText}
          </div>
        </Html>
      )}
      {selected && (
        <mesh>
          <boxGeometry args={[0.6, 1.8, 0.6]} />
          <meshBasicMaterial color="#e07820" wireframe transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

function Nodes() {
  const objects = useStudio((s) => s.objects);
  const selected = useStudio((s) => s.selectedIds);
  return (
    <>
      {objects.map((obj) => {
        const sel = selected.includes(obj.id);
        if (obj.kind === "asset" || obj.primitive === "asset") return <AssetNode key={obj.id} obj={obj} selected={sel} />;
        if (obj.kind === "mesh") return <StudioMesh key={obj.id} obj={obj} selected={sel} />;
        if (obj.kind === "light") return <LightNode key={obj.id} obj={obj} selected={sel} />;
        if (obj.kind === "camera") return <CameraNode key={obj.id} obj={obj} selected={sel} />;
        return <EmptyNode key={obj.id} obj={obj} selected={sel} />;
      })}
    </>
  );
}

function Gizmo() {
  const show = useStudio((s) => s.showGizmo);
  const mode = useStudio((s) => s.transformMode);
  const snap = useStudio((s) => s.snap);
  const activeId = useStudio((s) => s.activeId);
  const appMode = useStudio((s) => s.mode);
  const objectsLen = useStudio((s) => s.objects.length);
  const { scene } = useThree();
  const [target, setTarget] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!activeId) {
      setTarget(null);
      return;
    }
    const obj = scene.getObjectByName(activeId) ?? null;
    setTarget(obj);
  }, [activeId, scene, objectsLen]);

  if (!show || appMode === "sculpt" || !target) return null;
  return (
    <TransformControls
      object={target}
      mode={mode}
      translationSnap={snap ? 0.25 : undefined}
      rotationSnap={snap ? Math.PI / 12 : undefined}
      scaleSnap={snap ? 0.1 : undefined}
      onMouseDown={() => {
        useStudio.getState().setTransformDragging(true);
        useStudio.getState().pushHistory();
      }}
      onMouseUp={() => {
        useStudio.getState().setTransformDragging(false);
        const id = target.name;
        useStudio.getState().updateObject(id, {
          position: [target.position.x, target.position.y, target.position.z],
          rotation: [target.rotation.x, target.rotation.y, target.rotation.z],
          scale: [target.scale.x, target.scale.y, target.scale.z],
        });
        if (useStudio.getState().autoKey) useStudio.getState().insertKeyframe(id);
        useStudio.getState().applySnapToActive();
      }}
    />
  );
}

function SculptLayer() {
  const mode = useStudio((s) => s.mode);
  const sculpt = useStudio((s) => s.sculpt);
  const activeId = useStudio((s) => s.activeId);
  const { camera, gl, scene } = useThree();
  const painting = useRef(false);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const pointer = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    if (mode !== "sculpt") return;
    const el = gl.domElement;
    const ndc = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const apply = () => {
      if (!activeId) return;
      const group = scene.getObjectByName(activeId);
      const mesh = group?.getObjectByProperty("type", "Mesh") as THREE.Mesh | undefined;
      if (!mesh?.geometry) return;
      ray.setFromCamera(pointer, camera);
      const hits = ray.intersectObject(mesh, true);
      if (!hits[0]) return;
      const geo = mesh.geometry as THREE.BufferGeometry;
      const pos = geo.getAttribute("position") as THREE.BufferAttribute;
      const local = mesh.worldToLocal(hits[0].point.clone());
      const radius = sculpt.radius;
      const strength = sculpt.strength * 0.22;
      const v = new THREE.Vector3();
      const n = new THREE.Vector3();
      const nor = geo.getAttribute("normal");
      const sign = sculpt.brush === "flatten" || sculpt.brush === "scrape" ? -0.6 : sculpt.brush === "pinch" ? 0 : 1;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const d = v.distanceTo(local);
        if (d > radius) continue;
        const w = 1 - d / radius;
        const fall = w * w * (3 - 2 * w);
        if (nor) n.fromBufferAttribute(nor as THREE.BufferAttribute, i);
        else n.copy(v).normalize();
        if (sculpt.brush === "smooth") v.lerp(local, strength * fall * 0.2);
        else if (sculpt.brush === "grab") v.addScaledVector(new THREE.Vector3(0, strength * fall, 0), 1);
        else if (sculpt.brush === "pinch") v.lerp(local, strength * fall * 0.35);
        else if (sculpt.brush === "crease") v.addScaledVector(n, -strength * fall * 0.8);
        else v.addScaledVector(n, strength * fall * (sculpt.brush === "inflate" ? 1.4 : 1) * (sign || 1));
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      painting.current = true;
      ndc(e);
      apply();
    };
    const move = (e: PointerEvent) => {
      if (!painting.current) return;
      ndc(e);
      apply();
    };
    const up = () => {
      if (!painting.current) return;
      painting.current = false;
      if (!activeId) return;
      const group = scene.getObjectByName(activeId);
      const mesh = group?.getObjectByProperty("type", "Mesh") as THREE.Mesh | undefined;
      if (!mesh) return;
      const geo = mesh.geometry as THREE.BufferGeometry;
      const pos = geo.getAttribute("position");
      const nrm = geo.getAttribute("normal");
      useStudio.getState().updateObject(activeId, {
        primitive: "baked",
        baked: {
          position: Array.from(pos.array as Float32Array),
          normal: nrm ? Array.from(nrm.array as Float32Array) : undefined,
          index: geo.index ? (Array.from(geo.index.array as ArrayLike<number>) as number[]) : undefined,
        },
      });
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [mode, sculpt, activeId, camera, gl, scene, pointer, ray]);
  return null;
}

function Animator() {
  const acc = useRef(0);
  useFrame((_, dt) => {
    const s = useStudio.getState();
    if (!s.playing) return;
    acc.current += Math.min(dt, 0.1);
    const spf = 1 / Math.max(1, s.fps);
    while (acc.current >= spf) {
      acc.current -= spf;
      let f = s.frame + 1;
      if (f > s.frameEnd) f = s.frameStart;
      s.setFrame(f);
    }
  });
  return null;
}

function CaptureBinder() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    registerCapture(() => {
      const { renderWidth, renderHeight } = useStudio.getState();
      const url = captureRender(gl, scene, camera, renderWidth, renderHeight);
      useStudio.getState().setRenderDataUrl(url);
      return url;
    });
  }, [gl, scene, camera]);
  return null;
}

function StatsBinder() {
  const objects = useStudio((s) => s.objects);
  useEffect(() => {
    let n = 0;
    for (const o of objects) {
      if (o.kind !== "mesh") continue;
      try {
        const g = evaluateGeometry(o);
        const idx = g.index?.count ?? g.getAttribute("position").count;
        n += Math.floor(idx / 3);
        g.dispose();
      } catch {
        /* skip */
      }
    }
    useStudio.getState().setPolyCount(n);
  }, [objects]);
  return null;
}

function LightsFill() {
  const shading = useStudio((s) => s.shading);
  if (shading === "rendered") return null;
  return (
    <>
      <hemisphereLight args={["#d7dce4", "#2a2c32", 0.55]} />
      <ambientLight intensity={0.22} />
    </>
  );
}

function WorldFx() {
  const shading = useStudio((s) => s.shading);
  const env = useStudio((s) => s.envPreset);
  const intensity = useStudio((s) => s.envIntensity);
  const bloom = useStudio((s) => s.bloom);
  const ssao = useStudio((s) => s.ssao);
  const showGrid = useStudio((s) => s.showGrid);
  return (
    <>
      {(shading === "material" || shading === "rendered") && (
        <Environment preset={env} background={shading === "rendered"} environmentIntensity={intensity} />
      )}
      {showGrid && (
        <Grid
          infiniteGrid
          fadeDistance={40}
          fadeStrength={1}
          sectionColor="#3e4048"
          cellColor="#2a2c32"
          sectionSize={2}
          cellSize={0.5}
          position={[0, 0.001, 0]}
        />
      )}
      {shading !== "wire" && <ContactShadows position={[0, 0.0, 0]} opacity={0.45} scale={18} blur={2.2} far={8} />}
      {shading === "rendered" && (
        <EffectComposer>
          <N8AO aoRadius={0.45} intensity={1.8} enabled={ssao} />
          <Bloom luminanceThreshold={1.05} intensity={0.45} mipmapBlur />
          <Vignette darkness={0.45} offset={0.25} />
        </EffectComposer>
      )}
    </>
  );
}

function ViewRig() {
  const preset = useStudio((s) => s.viewPreset);
  const focusNonce = useStudio((s) => s.focusNonce);
  const mode = useStudio((s) => s.mode);
  const { camera } = useThree();
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  useEffect(() => {
    const map: Record<string, [number, number, number]> = {
      persp: [6.6, 4.1, 7.4],
      front: [0, 2, 10],
      top: [0, 12, 0.01],
      right: [10, 2, 0],
    };
    const p = map[preset];
    if (p) {
      camera.position.set(...p);
      controls.current?.target.set(0, 1, 0);
      controls.current?.update();
    }
  }, [preset, camera]);
  useEffect(() => {
    if (!focusNonce) return;
    const s = useStudio.getState();
    const obj = s.objects.find((o) => o.id === s.activeId);
    if (!obj) return;
    const live = worldOf(obj, s.frame);
    controls.current?.target.set(...live.position);
    camera.position.set(live.position[0] + 4.2, live.position[1] + 2.4, live.position[2] + 4.2);
    controls.current?.update();
  }, [focusNonce, camera]);
  const camObj = useStudio((s) => s.objects.find((o) => o.id === s.viewCameraId));
  return (
    <>
      {preset === "camera" && camObj ? (
        <PerspectiveCamera
          makeDefault
          fov={camObj.cameraFov}
          position={camObj.position}
          rotation={camObj.rotation}
        />
      ) : null}
      <OrbitControls
        ref={controls}
        makeDefault={preset !== "camera"}
        enableDamping
        dampingFactor={0.12}
        enableRotate={mode !== "sculpt" && preset !== "camera"}
        minDistance={1}
        maxDistance={80}
        maxPolarAngle={preset === "top" ? Math.PI * 0.02 : Math.PI * 0.49}
      />
    </>
  );
}

export function Viewport() {
  const shading = useStudio((s) => s.shading);
  return (
    <Canvas
      className="h-full w-full touch-none bg-viewport"
      shadows
      dpr={[1, 1.75]}
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ position: [6.6, 4.1, 7.4], fov: 40, near: 0.05, far: 250 }}
      onPointerMissed={() => useStudio.getState().clearSelection()}
    >
      <color attach="background" args={[shading === "rendered" ? "#0e0f12" : "#1a1b1f"]} />
      {shading !== "rendered" && <fog attach="fog" args={["#1a1b1f", 22, 60]} />}
      <ViewRig />
      <LightsFill />
      <Nodes />
      <WorldFx />
      <Gizmo />
      <SculptLayer />
      <Animator />
      <CaptureBinder />
      <StatsBinder />
      <GizmoHelper alignment="bottom-right" margin={[56, 56]}>
        <GizmoViewport axisColors={["#c45c4a", "#6aa56f", "#5b7cbc"]} labelColor="#e8e8ea" />
      </GizmoHelper>
    </Canvas>
  );
}
