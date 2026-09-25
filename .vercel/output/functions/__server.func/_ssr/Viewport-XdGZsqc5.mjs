import { i as __toESM } from "../_runtime.mjs";
import { a as GizmoHelper, b as require_react, c as PerspectiveCamera, d as Canvas, h as useThree, i as GizmoViewport, l as Text, m as useFrame, n as Environment, o as TransformControls, r as Grid, s as OrbitControls, t as ContactShadows, u as Html, y as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { An as SRGBColorSpace, Sn as Raycaster, Tn as RepeatWrapping, Wn as TextureLoader, cr as Vector3, sr as Vector2, u as AnimationMixer } from "../_libs/monogrid__gainmap-js+three.mjs";
import { S as clone, x as RectAreaLightUniformsLib } from "../_libs/three.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as formatLoadError, c as useStudio, d as registerCapture, i as loadRuntime, l as evaluateGeometry, n as t, o as resolveAssetUrl, r as captureRender, s as evalObjectAtFrame, u as geometrySignature } from "./routes-B5_ZQt4L.mjs";
import { i as Vignette, n as EffectComposer, r as N8AO, t as Bloom } from "../_libs/@react-three/postprocessing+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Viewport-XdGZsqc5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
RectAreaLightUniformsLib.init();
function worldOf(obj, frame) {
	const live = evalObjectAtFrame(obj, frame);
	if (!obj.parentId) return live;
	const parent = useStudio.getState().objects.find((o) => o.id === obj.parentId);
	if (!parent) return live;
	const p = evalObjectAtFrame(parent, frame);
	return {
		position: [
			live.position[0] + p.position[0],
			live.position[1] + p.position[1],
			live.position[2] + p.position[2]
		],
		rotation: [
			live.rotation[0] + p.rotation[0],
			live.rotation[1] + p.rotation[1],
			live.rotation[2] + p.rotation[2]
		],
		scale: [
			live.scale[0] * p.scale[0],
			live.scale[1] * p.scale[1],
			live.scale[2] * p.scale[2]
		]
	};
}
function useLive(obj) {
	const live = worldOf(obj, useStudio((s) => s.frame));
	if (useStudio((s) => s.transformDragging && s.activeId === obj.id)) return {
		position: void 0,
		rotation: void 0,
		scale: void 0,
		skip: true
	};
	return {
		...live,
		skip: false
	};
}
function StudioMesh({ obj, selected }) {
	const shading = useStudio((s) => s.shading);
	const sig = geometrySignature(obj);
	const geo = (0, import_react.useMemo)(() => evaluateGeometry(obj), [obj, sig]);
	(0, import_react.useEffect)(() => () => geo.dispose(), [geo]);
	const live = useLive(obj);
	const mat = obj.material;
	const [map, setMap] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!mat.mapUrl) {
			setMap(null);
			return;
		}
		let dead = false;
		const loader = new TextureLoader();
		resolveAssetUrl(mat.mapUrl).then((url) => new Promise((resolve, reject) => {
			loader.load(url, resolve, void 0, reject);
		})).then((tex) => {
			if (dead) {
				tex.dispose();
				return;
			}
			tex.colorSpace = SRGBColorSpace;
			tex.wrapS = tex.wrapT = RepeatWrapping;
			setMap(tex);
		}).catch(() => {
			if (!dead) setMap(null);
		});
		return () => {
			dead = true;
		};
	}, [mat.mapUrl]);
	(0, import_react.useEffect)(() => () => map?.dispose(), [map]);
	const common = {
		color: mat.color,
		roughness: mat.roughness,
		metalness: mat.metalness,
		emissive: mat.emissive,
		emissiveIntensity: mat.emissiveIntensity,
		wireframe: shading === "wire" || mat.wireframe,
		flatShading: mat.flat,
		transparent: mat.opacity < .999 || mat.transmission > .01,
		opacity: mat.opacity,
		side: 2,
		map: map ?? void 0
	};
	const material = shading === "wire" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
		color: selected ? "#e07820" : "#9aa0a8",
		wireframe: true
	}) : shading === "solid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshLambertMaterial", {
		color: mat.color,
		wireframe: mat.wireframe,
		flatShading: mat.flat,
		map
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshPhysicalMaterial", {
		...common,
		transmission: mat.transmission,
		thickness: mat.thickness,
		ior: mat.ior,
		clearcoat: mat.clearcoat,
		clearcoatRoughness: mat.clearcoatRoughness,
		envMapIntensity: mat.envMapIntensity,
		iridescence: mat.iridescence,
		sheen: mat.sheen,
		sheenRoughness: .4
	});
	const isText = obj.primitive === "text";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: obj.id,
		position: live.skip ? void 0 : live.position,
		rotation: live.skip ? void 0 : live.rotation,
		scale: live.skip ? void 0 : live.scale,
		visible: obj.visible,
		userData: { id: obj.id },
		onClick: (e) => {
			e.stopPropagation();
			useStudio.getState().select(obj.id, e.shiftKey);
		},
		children: [isText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
			fontSize: Number(obj.params.size) || .55,
			color: mat.color,
			anchorX: "center",
			anchorY: "middle",
			depthOffset: -1,
			children: String(obj.params.text || "ZYNYX")
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry: geo,
			castShadow: true,
			receiveShadow: true,
			children: material
		}), selected && shading !== "wire" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
			geometry: geo,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#e07820",
				wireframe: true,
				transparent: true,
				opacity: .35
			})
		})]
	});
}
function LightNode({ obj, selected }) {
	const live = useLive(obj);
	const L = obj.light;
	if (!L) return null;
	const color = L.color;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: obj.id,
		position: live.skip ? void 0 : live.position,
		rotation: live.skip ? void 0 : live.rotation,
		visible: obj.visible,
		userData: { id: obj.id },
		onClick: (e) => {
			e.stopPropagation();
			useStudio.getState().select(obj.id, e.shiftKey);
		},
		children: [
			L.type === "sun" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				color,
				intensity: L.intensity,
				castShadow: L.castShadow,
				"shadow-mapSize": [2048, 2048],
				"shadow-bias": -2e-4
			}),
			L.type === "point" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
				color,
				intensity: L.intensity,
				distance: L.distance,
				castShadow: L.castShadow
			}),
			L.type === "spot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
				color,
				intensity: L.intensity,
				angle: L.angle,
				penumbra: .35,
				distance: L.distance,
				castShadow: L.castShadow
			}),
			L.type === "area" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rectAreaLight", {
				color,
				intensity: L.intensity,
				width: L.width,
				height: L.height
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.12,
				12,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: selected ? "#e07820" : color })] })
		]
	});
}
function CameraNode({ obj, selected }) {
	const live = useLive(obj);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: obj.id,
		position: live.skip ? void 0 : live.position,
		rotation: live.skip ? void 0 : live.rotation,
		visible: obj.visible,
		userData: { id: obj.id },
		onClick: (e) => {
			e.stopPropagation();
			useStudio.getState().select(obj.id, e.shiftKey);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
			.28,
			.2,
			.4
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: selected ? "#e07820" : "#3a3c44",
			metalness: .4,
			roughness: .4
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				0,
				-.28
			],
			rotation: [
				Math.PI / 2,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
				.14,
				.22,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#222" })]
		})]
	});
}
function EmptyNode({ obj, selected }) {
	const live = useLive(obj);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: obj.id,
		position: live.skip ? void 0 : live.position,
		rotation: live.skip ? void 0 : live.rotation,
		scale: live.skip ? void 0 : live.scale,
		visible: obj.visible,
		userData: { id: obj.id },
		onClick: (e) => {
			e.stopPropagation();
			useStudio.getState().select(obj.id, e.shiftKey);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("axesHelper", { args: [.6] }), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("octahedronGeometry", { args: [.1, 0] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", { color: "#e07820" })] })]
	});
}
function AssetNode({ obj, selected }) {
	const live = useLive(obj);
	const mixer = (0, import_react.useRef)(null);
	const clipsRef = (0, import_react.useRef)([]);
	const [root, setRoot] = (0, import_react.useState)(null);
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [errText, setErrText] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!obj.assetUrl || !obj.assetFormat) {
			setFailed(true);
			setRoot(null);
			setErrText(obj.loadError || t(useStudio.getState().lang, "reimport"));
			return;
		}
		let dead = false;
		setFailed(false);
		setErrText(null);
		loadRuntime(obj.assetUrl, obj.assetFormat).then((loaded) => {
			if (dead) return;
			const clone$1 = clone(loaded.root);
			clone$1.traverse((n) => {
				const mesh = n;
				if (mesh.isMesh) {
					mesh.castShadow = true;
					mesh.receiveShadow = true;
				}
			});
			mixer.current = new AnimationMixer(clone$1);
			clipsRef.current = loaded.clips;
			const names = loaded.clips.map((c) => c.name || "clip");
			const st = useStudio.getState();
			const cur = st.objects.find((o) => o.id === obj.id);
			const patch = {};
			if (names.length && (!cur?.clips || cur.clips.join("\0") !== names.join("\0"))) patch.clips = names;
			if (names.length && !cur?.clipName) patch.clipName = names[0];
			if (cur?.assetMissing) patch.assetMissing = false;
			if (cur?.loadError) patch.loadError = void 0;
			if (Object.keys(patch).length) st.updateObject(obj.id, patch);
			setRoot(clone$1);
		}).catch((err) => {
			if (dead) return;
			const lang = useStudio.getState().lang;
			const msg = formatLoadError(err, obj.name, lang);
			setFailed(true);
			setErrText(msg);
			const st = useStudio.getState();
			if (st.objects.find((o) => o.id === obj.id)?.loadError !== msg) {
				st.updateObject(obj.id, {
					assetMissing: true,
					loadError: msg
				});
				st.log({
					kind: "err",
					text: msg
				});
				toast.error(msg);
			}
		});
		return () => {
			dead = true;
			mixer.current?.stopAllAction();
			mixer.current = null;
			clipsRef.current = [];
		};
	}, [
		obj.assetUrl,
		obj.assetFormat,
		obj.id,
		obj.name
	]);
	(0, import_react.useEffect)(() => {
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
		const dur = Math.max(.001, clip.duration);
		const tSec = (s.frame - s.frameStart) / Math.max(1, s.fps) * speed;
		mix.setTime((tSec % dur + dur) % dur);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		name: obj.id,
		position: live.skip ? void 0 : live.position,
		rotation: live.skip ? void 0 : live.rotation,
		scale: live.skip ? void 0 : live.scale,
		visible: obj.visible,
		userData: { id: obj.id },
		onClick: (e) => {
			e.stopPropagation();
			useStudio.getState().select(obj.id, e.shiftKey);
		},
		children: [
			root ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: root }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("capsuleGeometry", { args: [
				.2,
				1.1,
				6,
				12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: failed ? "#d4524a" : "#e07820",
				wireframe: true
			})] }),
			failed && errText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
				center: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-48 rounded-sm bg-bg-elevated/90 px-2 py-1 text-center text-2xs text-danger",
					children: errText
				})
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.6,
				1.8,
				.6
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
				color: "#e07820",
				wireframe: true,
				transparent: true,
				opacity: .35
			})] })
		]
	});
}
function Nodes() {
	const objects = useStudio((s) => s.objects);
	const selected = useStudio((s) => s.selectedIds);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: objects.map((obj) => {
		const sel = selected.includes(obj.id);
		if (obj.kind === "asset" || obj.primitive === "asset") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetNode, {
			obj,
			selected: sel
		}, obj.id);
		if (obj.kind === "mesh") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioMesh, {
			obj,
			selected: sel
		}, obj.id);
		if (obj.kind === "light") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LightNode, {
			obj,
			selected: sel
		}, obj.id);
		if (obj.kind === "camera") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraNode, {
			obj,
			selected: sel
		}, obj.id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyNode, {
			obj,
			selected: sel
		}, obj.id);
	}) });
}
function Gizmo() {
	const show = useStudio((s) => s.showGizmo);
	const mode = useStudio((s) => s.transformMode);
	const snap = useStudio((s) => s.snap);
	const activeId = useStudio((s) => s.activeId);
	const appMode = useStudio((s) => s.mode);
	const objectsLen = useStudio((s) => s.objects.length);
	const { scene } = useThree();
	const [target, setTarget] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!activeId) {
			setTarget(null);
			return;
		}
		const obj = scene.getObjectByName(activeId) ?? null;
		setTarget(obj);
	}, [
		activeId,
		scene,
		objectsLen
	]);
	if (!show || appMode === "sculpt" || !target) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransformControls, {
		object: target,
		mode,
		translationSnap: snap ? .25 : void 0,
		rotationSnap: snap ? Math.PI / 12 : void 0,
		scaleSnap: snap ? .1 : void 0,
		onMouseDown: () => {
			useStudio.getState().setTransformDragging(true);
			useStudio.getState().pushHistory();
		},
		onMouseUp: () => {
			useStudio.getState().setTransformDragging(false);
			const id = target.name;
			useStudio.getState().updateObject(id, {
				position: [
					target.position.x,
					target.position.y,
					target.position.z
				],
				rotation: [
					target.rotation.x,
					target.rotation.y,
					target.rotation.z
				],
				scale: [
					target.scale.x,
					target.scale.y,
					target.scale.z
				]
			});
			if (useStudio.getState().autoKey) useStudio.getState().insertKeyframe(id);
			useStudio.getState().applySnapToActive();
		}
	});
}
function SculptLayer() {
	const mode = useStudio((s) => s.mode);
	const sculpt = useStudio((s) => s.sculpt);
	const activeId = useStudio((s) => s.activeId);
	const { camera, gl, scene } = useThree();
	const painting = (0, import_react.useRef)(false);
	const ray = (0, import_react.useMemo)(() => new Raycaster(), []);
	const pointer = (0, import_react.useMemo)(() => new Vector2(), []);
	(0, import_react.useEffect)(() => {
		if (mode !== "sculpt") return;
		const el = gl.domElement;
		const ndc = (e) => {
			const r = el.getBoundingClientRect();
			pointer.x = (e.clientX - r.left) / r.width * 2 - 1;
			pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
		};
		const apply = () => {
			if (!activeId) return;
			const mesh = scene.getObjectByName(activeId)?.getObjectByProperty("type", "Mesh");
			if (!mesh?.geometry) return;
			ray.setFromCamera(pointer, camera);
			const hits = ray.intersectObject(mesh, true);
			if (!hits[0]) return;
			const geo = mesh.geometry;
			const pos = geo.getAttribute("position");
			const local = mesh.worldToLocal(hits[0].point.clone());
			const radius = sculpt.radius;
			const strength = sculpt.strength * .22;
			const v = new Vector3();
			const n = new Vector3();
			const nor = geo.getAttribute("normal");
			const sign = sculpt.brush === "flatten" || sculpt.brush === "scrape" ? -.6 : sculpt.brush === "pinch" ? 0 : 1;
			for (let i = 0; i < pos.count; i++) {
				v.fromBufferAttribute(pos, i);
				const d = v.distanceTo(local);
				if (d > radius) continue;
				const w = 1 - d / radius;
				const fall = w * w * (3 - 2 * w);
				if (nor) n.fromBufferAttribute(nor, i);
				else n.copy(v).normalize();
				if (sculpt.brush === "smooth") v.lerp(local, strength * fall * .2);
				else if (sculpt.brush === "grab") v.addScaledVector(new Vector3(0, strength * fall, 0), 1);
				else if (sculpt.brush === "pinch") v.lerp(local, strength * fall * .35);
				else if (sculpt.brush === "crease") v.addScaledVector(n, -strength * fall * .8);
				else v.addScaledVector(n, strength * fall * (sculpt.brush === "inflate" ? 1.4 : 1) * (sign || 1));
				pos.setXYZ(i, v.x, v.y, v.z);
			}
			pos.needsUpdate = true;
			geo.computeVertexNormals();
		};
		const down = (e) => {
			if (e.button !== 0) return;
			painting.current = true;
			ndc(e);
			apply();
		};
		const move = (e) => {
			if (!painting.current) return;
			ndc(e);
			apply();
		};
		const up = () => {
			if (!painting.current) return;
			painting.current = false;
			if (!activeId) return;
			const mesh = scene.getObjectByName(activeId)?.getObjectByProperty("type", "Mesh");
			if (!mesh) return;
			const geo = mesh.geometry;
			const pos = geo.getAttribute("position");
			const nrm = geo.getAttribute("normal");
			useStudio.getState().updateObject(activeId, {
				primitive: "baked",
				baked: {
					position: Array.from(pos.array),
					normal: nrm ? Array.from(nrm.array) : void 0,
					index: geo.index ? Array.from(geo.index.array) : void 0
				}
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
	}, [
		mode,
		sculpt,
		activeId,
		camera,
		gl,
		scene,
		pointer,
		ray
	]);
	return null;
}
function Animator() {
	const acc = (0, import_react.useRef)(0);
	useFrame((_, dt) => {
		const s = useStudio.getState();
		if (!s.playing) return;
		acc.current += Math.min(dt, .1);
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
	(0, import_react.useEffect)(() => {
		registerCapture(() => {
			const { renderWidth, renderHeight } = useStudio.getState();
			const url = captureRender(gl, scene, camera, renderWidth, renderHeight);
			useStudio.getState().setRenderDataUrl(url);
			return url;
		});
	}, [
		gl,
		scene,
		camera
	]);
	return null;
}
function StatsBinder() {
	const objects = useStudio((s) => s.objects);
	(0, import_react.useEffect)(() => {
		let n = 0;
		for (const o of objects) {
			if (o.kind !== "mesh") continue;
			try {
				const g = evaluateGeometry(o);
				const idx = g.index?.count ?? g.getAttribute("position").count;
				n += Math.floor(idx / 3);
				g.dispose();
			} catch {}
		}
		useStudio.getState().setPolyCount(n);
	}, [objects]);
	return null;
}
function LightsFill() {
	if (useStudio((s) => s.shading) === "rendered") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
		"#d7dce4",
		"#2a2c32",
		.55
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .22 })] });
}
function WorldFx() {
	const shading = useStudio((s) => s.shading);
	const env = useStudio((s) => s.envPreset);
	const intensity = useStudio((s) => s.envIntensity);
	useStudio((s) => s.bloom);
	const ssao = useStudio((s) => s.ssao);
	const showGrid = useStudio((s) => s.showGrid);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(shading === "material" || shading === "rendered") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Environment, {
			preset: env,
			background: shading === "rendered",
			environmentIntensity: intensity
		}),
		showGrid && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid, {
			infiniteGrid: true,
			fadeDistance: 40,
			fadeStrength: 1,
			sectionColor: "#3e4048",
			cellColor: "#2a2c32",
			sectionSize: 2,
			cellSize: .5,
			position: [
				0,
				.001,
				0
			]
		}),
		shading !== "wire" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
			position: [
				0,
				0,
				0
			],
			opacity: .45,
			scale: 18,
			blur: 2.2,
			far: 8
		}),
		shading === "rendered" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EffectComposer, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(N8AO, {
				aoRadius: .45,
				intensity: 1.8,
				enabled: ssao
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bloom, {
				luminanceThreshold: 1.05,
				intensity: .45,
				mipmapBlur: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vignette, {
				darkness: .45,
				offset: .25
			})
		] })
	] });
}
function ViewRig() {
	const preset = useStudio((s) => s.viewPreset);
	const focusNonce = useStudio((s) => s.focusNonce);
	const mode = useStudio((s) => s.mode);
	const { camera } = useThree();
	const controls = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const p = {
			persp: [
				6.6,
				4.1,
				7.4
			],
			front: [
				0,
				2,
				10
			],
			top: [
				0,
				12,
				.01
			],
			right: [
				10,
				2,
				0
			]
		}[preset];
		if (p) {
			camera.position.set(...p);
			controls.current?.target.set(0, 1, 0);
			controls.current?.update();
		}
	}, [preset, camera]);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [preset === "camera" && camObj ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerspectiveCamera, {
		makeDefault: true,
		fov: camObj.cameraFov,
		position: camObj.position,
		rotation: camObj.rotation
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
		ref: controls,
		makeDefault: preset !== "camera",
		enableDamping: true,
		dampingFactor: .12,
		enableRotate: mode !== "sculpt" && preset !== "camera",
		minDistance: 1,
		maxDistance: 80,
		maxPolarAngle: preset === "top" ? Math.PI * .02 : Math.PI * .49
	})] });
}
function Viewport() {
	const shading = useStudio((s) => s.shading);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		className: "h-full w-full touch-none bg-viewport",
		shadows: true,
		dpr: [1, 1.75],
		gl: {
			preserveDrawingBuffer: true,
			antialias: true,
			toneMapping: 4,
			toneMappingExposure: 1.05
		},
		camera: {
			position: [
				6.6,
				4.1,
				7.4
			],
			fov: 40,
			near: .05,
			far: 250
		},
		onPointerMissed: () => useStudio.getState().clearSelection(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
				attach: "background",
				args: [shading === "rendered" ? "#0e0f12" : "#1a1b1f"]
			}),
			shading !== "rendered" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
				attach: "fog",
				args: [
					"#1a1b1f",
					22,
					60
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewRig, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LightsFill, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nodes, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldFx, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gizmo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SculptLayer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Animator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptureBinder, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsBinder, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GizmoHelper, {
				alignment: "bottom-right",
				margin: [56, 56],
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GizmoViewport, {
					axisColors: [
						"#c45c4a",
						"#6aa56f",
						"#5b7cbc"
					],
					labelColor: "#e8e8ea"
				})
			})
		]
	});
}
//#endregion
export { Viewport };
