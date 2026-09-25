import { i as __toESM } from "../_runtime.mjs";
import { b as require_react, y as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { B as Euler, Dt as Mesh, Et as Matrix4, Ft as MeshStandardMaterial, Gt as PerspectiveCamera, H as ExtrudeGeometry, Kn as TorusGeometry, Nn as Shape, O as ConeGeometry, Qt as Quaternion, W as Float32BufferAttribute, Wt as Path, Xt as PointsMaterial, Y as IcosahedronGeometry, Yn as TubeGeometry, Yt as Points, _ as BufferGeometry, b as CatmullRomCurve3, cr as Vector3, g as BufferAttribute, h as BoxGeometry, j as CylinderGeometry, m as Box3, o as WebGLRenderer, q as Group, qn as TorusKnotGeometry, qt as PlaneGeometry, sr as Vector2, ut as LatheGeometry, y as CapsuleGeometry, zn as SphereGeometry } from "../_libs/monogrid__gainmap-js+three.mjs";
import { C as GLTFExporter, E as mergeVertices, S as clone, T as mergeGeometries, w as RoundedBoxGeometry } from "../_libs/three.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { S as Box, _ as EyeOff, a as Scaling, b as Copy, c as Plus, d as Lightbulb, f as Keyboard, g as Eye, h as FileCode, i as Trash2, l as Play, m as Grid3x3, n as Undo2, o as RotateCw, p as Image, s as Redo2, t as X, u as Move, v as Download, x as Camera, y as Cylinder } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B5_ZQt4L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var capture = () => null;
function registerCapture(fn) {
	capture = fn;
}
function captureStill() {
	return capture();
}
function fade(t) {
	return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function hash3(x, y, z) {
	let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1442695041);
	h = Math.imul(h ^ h >>> 13, 1274126177);
	return ((h ^ h >>> 16) >>> 0) / 4294967295;
}
function noise3(x, y, z) {
	const ix = Math.floor(x);
	const iy = Math.floor(y);
	const iz = Math.floor(z);
	const fx = x - ix;
	const fy = y - iy;
	const fz = z - iz;
	const u = fade(fx);
	const v = fade(fy);
	const w = fade(fz);
	const n000 = hash3(ix, iy, iz);
	const n100 = hash3(ix + 1, iy, iz);
	const n010 = hash3(ix, iy + 1, iz);
	const n110 = hash3(ix + 1, iy + 1, iz);
	const n001 = hash3(ix, iy, iz + 1);
	const n101 = hash3(ix + 1, iy, iz + 1);
	const n011 = hash3(ix, iy + 1, iz + 1);
	const n111 = hash3(ix + 1, iy + 1, iz + 1);
	return lerp(lerp(lerp(n000, n100, u), lerp(n010, n110, u), v), lerp(lerp(n001, n101, u), lerp(n011, n111, u), v), w);
}
function merge$1(geos) {
	const ok = geos.filter((g) => g.getAttribute("position"));
	if (!ok.length) return new BoxGeometry(.2, .2, .2);
	for (const g of ok) {
		if (!g.index) g.setIndex([...Array(g.getAttribute("position").count).keys()]);
		if (!g.getAttribute("normal")) g.computeVertexNormals();
		if (!g.getAttribute("uv")) {
			const n = g.getAttribute("position").count;
			g.setAttribute("uv", new BufferAttribute(new Float32Array(n * 2), 2));
		}
	}
	const merged = mergeGeometries(ok, false);
	ok.forEach((g) => g.dispose());
	return merged ?? new BoxGeometry(.2, .2, .2);
}
function ek(a, b) {
	return a < b ? `${a}_${b}` : `${b}_${a}`;
}
function toIndexedTriangles(geo) {
	let g = geo.index ? geo.clone() : geo.clone();
	if (!g.index) {
		const n = g.getAttribute("position").count;
		g.setIndex(Array.from({ length: n }, (_, i) => i));
	}
	g = mergeVertices(g, 1e-6);
	const idx = g.index;
	const tris = [];
	for (let i = 0; i < idx.count; i += 3) tris.push(idx.getX(i), idx.getX(i + 1), idx.getX(i + 2));
	g.setIndex(tris);
	return g;
}
function loopOnce(geo) {
	const merged = toIndexedTriangles(geo);
	const index = Array.from(merged.index.array);
	const pos = merged.getAttribute("position");
	const nV = pos.count;
	const nF = Math.floor(index.length / 3);
	const adj = Array.from({ length: nV }, () => []);
	const edges = /* @__PURE__ */ new Map();
	const faces = [];
	for (let f = 0; f < nF; f++) {
		const a = index[f * 3];
		const b = index[f * 3 + 1];
		const c = index[f * 3 + 2];
		faces.push([
			a,
			b,
			c
		]);
		for (const [u, v] of [
			[a, b],
			[b, c],
			[c, a]
		]) {
			const k = ek(u, v);
			let e = edges.get(k);
			if (!e) {
				e = {
					a: u,
					b: v,
					faces: []
				};
				edges.set(k, e);
			}
			e.faces.push(f);
			if (!adj[u].includes(v)) adj[u].push(v);
			if (!adj[v].includes(u)) adj[v].push(u);
		}
	}
	const oldPos = [];
	for (let i = 0; i < nV; i++) oldPos.push(new Vector3().fromBufferAttribute(pos, i));
	const outVerts = [];
	for (let i = 0; i < nV; i++) {
		const nb = adj[i];
		const n = nb.length;
		if (!n) {
			outVerts.push(oldPos[i].clone());
			continue;
		}
		if (nb.some((j) => (edges.get(ek(i, j))?.faces.length ?? 0) < 2)) {
			const bnb = nb.filter((j) => (edges.get(ek(i, j))?.faces.length ?? 0) < 2);
			const p = oldPos[i].clone().multiplyScalar(.75);
			if (bnb.length >= 2) {
				p.addScaledVector(oldPos[bnb[0]], .125);
				p.addScaledVector(oldPos[bnb[1]], .125);
			} else p.copy(oldPos[i]);
			outVerts.push(p);
		} else {
			const beta = n === 3 ? 3 / 16 : 1 / n * (5 / 8 - (3 / 8 + .25 * Math.cos(2 * Math.PI / n)) ** 2);
			const p = oldPos[i].clone().multiplyScalar(1 - n * beta);
			for (const j of nb) p.addScaledVector(oldPos[j], beta);
			outVerts.push(p);
		}
	}
	const edgePointIndex = /* @__PURE__ */ new Map();
	for (const [k, e] of edges) {
		const pa = oldPos[e.a];
		const pb = oldPos[e.b];
		let ep;
		if (e.faces.length === 2) {
			const opposites = [];
			for (const fi of e.faces) {
				const other = faces[fi].find((v) => v !== e.a && v !== e.b);
				opposites.push(oldPos[other]);
			}
			ep = pa.clone().add(pb).multiplyScalar(3 / 8);
			ep.addScaledVector(opposites[0], 1 / 8);
			ep.addScaledVector(opposites[1], 1 / 8);
		} else ep = pa.clone().add(pb).multiplyScalar(.5);
		edgePointIndex.set(k, outVerts.length);
		outVerts.push(ep);
	}
	const newFaces = [];
	for (const [a, b, c] of faces) {
		const ab = edgePointIndex.get(ek(a, b));
		const bc = edgePointIndex.get(ek(b, c));
		const ca = edgePointIndex.get(ek(c, a));
		newFaces.push(a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca);
	}
	const out = new BufferGeometry();
	const arr = new Float32Array(outVerts.length * 3);
	outVerts.forEach((v, i) => {
		arr[i * 3] = v.x;
		arr[i * 3 + 1] = v.y;
		arr[i * 3 + 2] = v.z;
	});
	out.setAttribute("position", new BufferAttribute(arr, 3));
	out.setIndex(newFaces);
	if (merged.getAttribute("uv")) {}
	out.computeVertexNormals();
	merged.dispose();
	return out;
}
function loopSubdivide(geo, levels) {
	let g = geo;
	const n = Math.max(0, Math.min(3, Math.floor(levels)));
	for (let i = 0; i < n; i++) {
		if ((g.getAttribute("position")?.count ?? 0) > 6e4) break;
		const next = loopOnce(g);
		if (g !== geo) g.dispose();
		g = next;
	}
	return g;
}
function applySolidifyShell(geo, thickness) {
	const src = mergeVertices(geo.clone(), 1e-6);
	src.computeVertexNormals();
	const nrm = src.getAttribute("normal");
	const outer = src.clone();
	const inner = src.clone();
	const ip = inner.getAttribute("position");
	const t = thickness;
	for (let i = 0; i < ip.count; i++) ip.setXYZ(i, ip.getX(i) - nrm.getX(i) * t, ip.getY(i) - nrm.getY(i) * t, ip.getZ(i) - nrm.getZ(i) * t);
	const ii = inner.index;
	if (ii) for (let i = 0; i < ii.count; i += 3) {
		const a = ii.getX(i + 1);
		ii.setX(i + 1, ii.getX(i + 2));
		ii.setX(i + 2, a);
	}
	const edgeCount = /* @__PURE__ */ new Map();
	const idx = src.index;
	if (idx) for (let i = 0; i < idx.count; i += 3) {
		const a = idx.getX(i);
		const b = idx.getX(i + 1);
		const c = idx.getX(i + 2);
		for (const [u, v] of [
			[a, b],
			[b, c],
			[c, a]
		]) {
			const k = ek(u, v);
			const e = edgeCount.get(k) ?? {
				a: u,
				b: v,
				count: 0
			};
			e.count++;
			edgeCount.set(k, e);
		}
	}
	const outerPos = outer.getAttribute("position");
	const rim = [];
	for (const e of edgeCount.values()) {
		if (e.count !== 1) continue;
		const ax = outerPos.getX(e.a);
		const ay = outerPos.getY(e.a);
		const az = outerPos.getZ(e.a);
		const bx = outerPos.getX(e.b);
		const by = outerPos.getY(e.b);
		const bz = outerPos.getZ(e.b);
		const aix = ip.getX(e.a);
		const aiy = ip.getY(e.a);
		const aiz = ip.getZ(e.a);
		const bix = ip.getX(e.b);
		const biy = ip.getY(e.b);
		const biz = ip.getZ(e.b);
		rim.push(ax, ay, az, bx, by, bz, bix, biy, biz, ax, ay, az, bix, biy, biz, aix, aiy, aiz);
	}
	inner.computeVertexNormals();
	const parts = [outer, inner];
	if (rim.length) {
		const rg = new BufferGeometry();
		rg.setAttribute("position", new Float32BufferAttribute(rim, 3));
		rg.computeVertexNormals();
		parts.push(rg);
	}
	src.dispose();
	return merge$1(parts);
}
/** Face-inset chamfer that works on any triangle mesh, not just cubes. */
function applyBevelMesh(geo, width, segments = 1) {
	const src = geo.toNonIndexed();
	const pos = src.getAttribute("position");
	const faceCount = Math.floor(pos.count / 3);
	const w = Math.max(.001, width);
	const segs = Math.max(1, Math.min(4, Math.floor(segments)));
	const positions = [];
	const va = new Vector3();
	const vb = new Vector3();
	const vc = new Vector3();
	const n = new Vector3();
	const c = new Vector3();
	const ab = new Vector3();
	const ac = new Vector3();
	const insetOf = (v, centroid, t) => v.clone().lerp(centroid, Math.min(.48, t));
	for (let f = 0; f < faceCount; f++) {
		va.fromBufferAttribute(pos, f * 3);
		vb.fromBufferAttribute(pos, f * 3 + 1);
		vc.fromBufferAttribute(pos, f * 3 + 2);
		ab.subVectors(vb, va);
		ac.subVectors(vc, va);
		n.crossVectors(ab, ac);
		if (n.lengthSq() < 1e-12) continue;
		n.normalize();
		c.copy(va).add(vb).add(vc).multiplyScalar(1 / 3);
		const da = Math.max(.02, va.distanceTo(c));
		const t0 = Math.min(.45, w / da);
		let innerA = [
			va.clone(),
			vb.clone(),
			vc.clone()
		];
		for (let s = 1; s <= segs; s++) {
			const t = t0 * (s / segs);
			const next = [
				insetOf(va, c, t),
				insetOf(vb, c, t),
				insetOf(vc, c, t)
			];
			const ring = innerA;
			const inn = next;
			for (let k = 0; k < 3; k++) {
				const a0 = ring[k];
				const a1 = ring[(k + 1) % 3];
				const b0 = inn[k];
				const b1 = inn[(k + 1) % 3];
				pushTri(positions, a0, a1, b1);
				pushTri(positions, a0, b1, b0);
			}
			innerA = next;
		}
		pushTri(positions, innerA[0], innerA[1], innerA[2]);
	}
	src.dispose();
	const out = new BufferGeometry();
	out.setAttribute("position", new Float32BufferAttribute(positions, 3));
	out.computeVertexNormals();
	return out;
}
function pushTri(buf, a, b, c) {
	buf.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
}
function fbm(x, y, z) {
	let a = 0;
	let amp = 1;
	let f = 1;
	for (let i = 0; i < 5; i++) {
		a += (noise3(x * f, y * f, z * f) * 2 - 1) * amp;
		amp *= .5;
		f *= 2;
	}
	return a;
}
function ridged(x, y, z) {
	return 1 - Math.abs(fbm(x, y, z));
}
function worley(x, y, z) {
	const ix = Math.floor(x);
	const iy = Math.floor(y);
	const iz = Math.floor(z);
	let d = 99;
	for (let oz = -1; oz <= 1; oz++) for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
		const cx = ix + ox + noise3(ix + ox, iy + oy, iz + oz);
		const cy = iy + oy + noise3(ix + ox + 17, iy + oy, iz + oz);
		const cz = iz + oz + noise3(ix + ox, iy + oy + 9, iz + oz);
		const dx = x - cx;
		const dy = y - cy;
		const dz = z - cz;
		d = Math.min(d, dx * dx + dy * dy + dz * dz);
	}
	return Math.sqrt(d) * 2 - 1;
}
function applyDisplaceTextured(geo, amount, scale, texture = 0) {
	const pos = geo.getAttribute("position");
	if (!geo.getAttribute("normal")) geo.computeVertexNormals();
	const nor = geo.getAttribute("normal");
	const v = new Vector3();
	const n = new Vector3();
	const s = Math.max(.05, scale);
	for (let i = 0; i < pos.count; i++) {
		v.fromBufferAttribute(pos, i);
		n.fromBufferAttribute(nor, i);
		const nx = v.x * s;
		const ny = v.y * s;
		const nz = v.z * s;
		let h = 0;
		if (texture <= .5) h = noise3(nx, ny, nz) * 2 - 1;
		else if (texture <= 1.5) h = fbm(nx, ny, nz);
		else if (texture <= 2.5) h = ridged(nx, ny, nz) * 2 - 1;
		else h = worley(nx, ny, nz);
		v.addScaledVector(n, h * amount);
		pos.setXYZ(i, v.x, v.y, v.z);
	}
	pos.needsUpdate = true;
	geo.computeVertexNormals();
}
function num(params, key, fallback) {
	const v = params[key];
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}
function xform(geo, pos = [
	0,
	0,
	0
], rot = [
	0,
	0,
	0
], scale = [
	1,
	1,
	1
]) {
	const m = new Matrix4().compose(new Vector3(...pos), new Quaternion().setFromEuler(new Euler(...rot)), new Vector3(...scale));
	geo.applyMatrix4(m);
	return geo;
}
function merge(geos) {
	const ok = geos.filter((g) => g.getAttribute("position"));
	if (!ok.length) return new BoxGeometry(.2, .2, .2);
	for (const g of ok) {
		if (!g.index) g.setIndex([...Array(g.getAttribute("position").count).keys()]);
		if (!g.getAttribute("normal")) g.computeVertexNormals();
		if (!g.getAttribute("uv")) {
			const n = g.getAttribute("position").count;
			g.setAttribute("uv", new BufferAttribute(new Float32Array(n * 2), 2));
		}
	}
	const merged = mergeGeometries(ok, false);
	ok.forEach((g) => g.dispose());
	return merged ?? new BoxGeometry(.2, .2, .2);
}
function gearGeo(teeth, radius, depth, hole) {
	const t = Math.max(6, Math.floor(teeth));
	const shape = new Shape();
	const tooth = radius * .16;
	for (let i = 0; i < t; i++) {
		const a0 = i / t * Math.PI * 2;
		const a1 = (i + .28) / t * Math.PI * 2;
		const a2 = (i + .42) / t * Math.PI * 2;
		const a3 = (i + .58) / t * Math.PI * 2;
		const a4 = (i + .72) / t * Math.PI * 2;
		const fn = i === 0 ? "moveTo" : "lineTo";
		const pts = [
			[
				Math.cos(a0) * radius,
				Math.sin(a0) * radius,
				0
			],
			[
				Math.cos(a1) * radius,
				Math.sin(a1) * radius,
				0
			],
			[
				Math.cos(a2) * (radius + tooth),
				Math.sin(a2) * (radius + tooth),
				0
			],
			[
				Math.cos(a3) * (radius + tooth),
				Math.sin(a3) * (radius + tooth),
				0
			],
			[
				Math.cos(a4) * radius,
				Math.sin(a4) * radius,
				0
			]
		];
		if (fn === "moveTo") shape.moveTo(pts[0][0], pts[0][1]);
		else shape.lineTo(pts[0][0], pts[0][1]);
		shape.lineTo(pts[1][0], pts[1][1]);
		shape.lineTo(pts[2][0], pts[2][1]);
		shape.lineTo(pts[3][0], pts[3][1]);
		shape.lineTo(pts[4][0], pts[4][1]);
	}
	shape.closePath();
	const holeR = Math.max(.05, hole);
	const holePath = new Path();
	holePath.absellipse(0, 0, holeR, holeR, 0, Math.PI * 2, false);
	shape.holes.push(holePath);
	const g = new ExtrudeGeometry(shape, {
		depth,
		bevelEnabled: true,
		bevelThickness: .03,
		bevelSize: .03,
		bevelSegments: 2,
		curveSegments: 2
	});
	g.center();
	g.rotateX(-Math.PI / 2);
	return g;
}
function stairsGeo(steps, width, rise, run) {
	const n = Math.max(2, Math.floor(steps));
	const geos = [];
	for (let i = 0; i < n; i++) {
		const h = rise;
		const box = new BoxGeometry(width, h, run);
		geos.push(xform(box, [
			0,
			i * rise + h / 2,
			i * run + run / 2
		]));
	}
	return merge(geos);
}
function helixCurve(turns, radius, height) {
	const pts = [];
	const n = Math.max(24, Math.floor(turns * 28));
	for (let i = 0; i <= n; i++) {
		const t = i / n;
		const a = t * turns * Math.PI * 2;
		pts.push(new Vector3(Math.cos(a) * radius, t * height - height / 2, Math.sin(a) * radius));
	}
	return new CatmullRomCurve3(pts, false, "centripetal");
}
function columnGeo(height, radius) {
	return merge([
		xform(new CylinderGeometry(radius, radius * 1.05, height * .72, 24), [
			0,
			0,
			0
		]),
		xform(new CylinderGeometry(radius * 1.45, radius * 1.55, height * .08, 24), [
			0,
			-height * .4,
			0
		]),
		xform(new BoxGeometry(radius * 3.1, height * .06, radius * 3.1), [
			0,
			-height * .47,
			0
		]),
		xform(new CylinderGeometry(radius * 1.55, radius * 1.35, height * .08, 24), [
			0,
			height * .4,
			0
		]),
		xform(new BoxGeometry(radius * 3.2, height * .05, radius * 3.2), [
			0,
			height * .47,
			0
		])
	]);
}
function treeGeo(seed, height) {
	const foliage = [xform(new CylinderGeometry(.08, .14, height * .45, 8), [
		0,
		height * .2,
		0
	])];
	const layers = 4;
	for (let i = 0; i < layers; i++) {
		const t = i / 3;
		const y = height * (.38 + t * .42);
		const r = (1 - t) * .85 + .18;
		const cone = new ConeGeometry(r, height * .28, 8);
		foliage.push(xform(cone, [
			0,
			y,
			0
		]));
	}
	const n = noise3(seed, 2, 9);
	foliage.push(xform(new SphereGeometry(.12 + n * .08, 6, 6), [
		.2,
		height * .55,
		.1
	]));
	return merge(foliage);
}
function rockGeo(radius, seed) {
	const g = new IcosahedronGeometry(radius, 2);
	const pos = g.getAttribute("position");
	const v = new Vector3();
	for (let i = 0; i < pos.count; i++) {
		v.fromBufferAttribute(pos, i);
		const n = noise3(v.x * 2.2 + seed, v.y * 2.2, v.z * 2.2);
		v.multiplyScalar(.72 + n * .55);
		pos.setXYZ(i, v.x, v.y, v.z);
	}
	g.computeVertexNormals();
	return g;
}
function vaseGeo(height, radius) {
	const pts = [];
	for (let i = 0; i < 18; i++) {
		const t = i / 17;
		const r = radius * (.35 + Math.sin(t * Math.PI) * .55 + (t > .82 ? (t - .82) * 1.6 : 0) + (t < .12 ? .2 : 0));
		pts.push(new Vector2(Math.max(.04, r), t * height - height / 2));
	}
	return new LatheGeometry(pts, 32);
}
function dnaGeo(turns, radius, height) {
	const tube1 = new TubeGeometry(helixCurve(turns, radius, height), 80, .045, 8, false);
	const tube2 = new TubeGeometry(helixCurve(turns, radius, height), 80, .045, 8, false);
	const p = tube2.getAttribute("position");
	for (let i = 0; i < p.count; i++) p.setXYZ(i, -p.getX(i), p.getY(i), -p.getZ(i));
	tube2.computeVertexNormals();
	const rungs = [tube1, tube2];
	const count = Math.max(8, Math.floor(turns * 8));
	for (let i = 0; i < count; i++) {
		const t = (i + .5) / count;
		const a = t * turns * Math.PI * 2;
		const y = t * height - height / 2;
		Math.cos(a) * radius;
		Math.sin(a) * radius;
		const rung = new CylinderGeometry(.025, .025, radius * 2, 6);
		rung.rotateZ(Math.PI / 2);
		rungs.push(xform(rung, [
			0,
			y,
			0
		], [
			0,
			-a,
			0
		]));
	}
	return merge(rungs);
}
function textFallback(size) {
	const s = new Shape();
	const w = size * 2.4;
	const h = size;
	s.moveTo(-w / 2, -h / 2);
	s.lineTo(w / 2, -h / 2);
	s.lineTo(w / 2, h / 2);
	s.lineTo(-w / 2, h / 2);
	s.closePath();
	const g = new ExtrudeGeometry(s, {
		depth: size * .22,
		bevelEnabled: false
	});
	g.center();
	return g;
}
function bakedGeo(obj) {
	const b = obj.baked;
	if (!b) return new BoxGeometry(1, 1, 1);
	const g = new BufferGeometry();
	g.setAttribute("position", new Float32BufferAttribute(b.position, 3));
	if (b.normal && b.normal.length) g.setAttribute("normal", new Float32BufferAttribute(b.normal, 3));
	if (b.uv && b.uv.length) g.setAttribute("uv", new Float32BufferAttribute(b.uv, 2));
	if (b.index && b.index.length) g.setIndex(b.index);
	if (!b.normal?.length) g.computeVertexNormals();
	return g;
}
function primitiveGeometry(type, params, obj) {
	const subdivBoost = 1;
	switch (type) {
		case "cube": {
			const s = num(params, "size", 1);
			return new BoxGeometry(s, s, s);
		}
		case "rounded": {
			const s = num(params, "size", 1);
			const r = num(params, "radius", .12);
			return new RoundedBoxGeometry(s, s, s, 4, r);
		}
		case "sphere": return new SphereGeometry(num(params, "radius", .75), Math.max(8, Math.floor(num(params, "segments", 32) * subdivBoost)), Math.max(6, Math.floor(num(params, "rings", 24) * subdivBoost)));
		case "ico": return new IcosahedronGeometry(num(params, "radius", .75), Math.max(0, Math.floor(num(params, "subdiv", 1))));
		case "cylinder": return new CylinderGeometry(num(params, "radiusTop", num(params, "radius", .5)), num(params, "radiusBottom", num(params, "radius", .5)), num(params, "depth", 1.4), Math.max(6, Math.floor(num(params, "segments", 24))));
		case "cone": return new ConeGeometry(num(params, "radius", .6), num(params, "depth", 1.4), Math.max(6, Math.floor(num(params, "segments", 24))));
		case "torus": return new TorusGeometry(num(params, "radius", .7), num(params, "tube", .22), Math.max(8, Math.floor(num(params, "radial", 16))), Math.max(12, Math.floor(num(params, "tubular", 48))));
		case "plane": return new PlaneGeometry(num(params, "size", 8), num(params, "size", 8), 1, 1).rotateX(-Math.PI / 2);
		case "capsule": return new CapsuleGeometry(num(params, "radius", .35), num(params, "depth", .9), 6, 16);
		case "knot": return new TorusKnotGeometry(num(params, "radius", .7), num(params, "tube", .22), Math.max(32, Math.floor(num(params, "tubular", 96))), Math.max(6, Math.floor(num(params, "radial", 16))), Math.max(1, Math.floor(num(params, "p", 2))), Math.max(1, Math.floor(num(params, "q", 3))));
		case "gear": return gearGeo(num(params, "teeth", 16), num(params, "radius", 1), num(params, "depth", .22), num(params, "hole", .22));
		case "stairs": return stairsGeo(num(params, "steps", 8), num(params, "width", 1.6), num(params, "rise", .18), num(params, "run", .32));
		case "helix": return new TubeGeometry(helixCurve(num(params, "turns", 5), num(params, "radius", .55), num(params, "height", 2.2)), 100, num(params, "tube", .08), 8, false);
		case "column": return columnGeo(num(params, "height", 3), num(params, "radius", .28));
		case "tree": return treeGeo(num(params, "seed", 3), num(params, "height", 2.4));
		case "rock": return rockGeo(num(params, "radius", .7), num(params, "seed", 4));
		case "vase": return vaseGeo(num(params, "height", 1.6), num(params, "radius", .45));
		case "dna": return dnaGeo(num(params, "turns", 4), num(params, "radius", .4), num(params, "height", 2.4));
		case "text": return textFallback(num(params, "size", .6));
		case "baked": return bakedGeo(obj ?? { baked: void 0 });
		case "asset": return new BoxGeometry(.2, .2, .2);
		default: return new BoxGeometry(1, 1, 1);
	}
}
function applyMirror(geo, axis) {
	const other = geo.clone();
	const s = [
		1,
		1,
		1
	];
	s[axis] = -1;
	xform(other, [
		0,
		0,
		0
	], [
		0,
		0,
		0
	], s);
	return merge([geo.clone(), other]);
}
function applyArray(geo, count, offset) {
	const n = Math.max(1, Math.floor(count));
	const parts = [];
	for (let i = 0; i < n; i++) parts.push(xform(geo.clone(), [
		offset[0] * i,
		offset[1] * i,
		offset[2] * i
	]));
	return merge(parts);
}
function evaluateGeometry(obj) {
	if (obj.kind !== "mesh") return new BufferGeometry();
	let geo = obj.primitive === "baked" || obj.baked ? bakedGeo(obj) : primitiveGeometry(obj.primitive, obj.params, obj);
	for (const mod of obj.modifiers) {
		if (!mod.enabled) continue;
		if (mod.type === "subdiv") {
			const next = loopSubdivide(geo, mod.params.levels ?? 1);
			if (next !== geo) {
				if (geo !== void 0) {}
				geo = next;
			}
		} else if (mod.type === "displace") applyDisplaceTextured(geo, mod.params.amount ?? .15, mod.params.scale ?? 2.2, mod.params.texture ?? 0);
		else if (mod.type === "solidify") geo = applySolidifyShell(geo, mod.params.thickness ?? .06);
		else if (mod.type === "mirror") geo = applyMirror(geo, Math.max(0, Math.min(2, Math.floor(mod.params.axis ?? 0))));
		else if (mod.type === "array") geo = applyArray(geo, mod.params.count ?? 3, [
			mod.params.offsetX ?? 1.2,
			mod.params.offsetY ?? 0,
			mod.params.offsetZ ?? 0
		]);
		else if (mod.type === "bevel") geo = applyBevelMesh(geo, mod.params.width ?? .08, mod.params.segments ?? 1);
	}
	geo.computeVertexNormals();
	return geo;
}
function geometrySignature(obj) {
	return JSON.stringify({
		p: obj.primitive,
		pa: obj.params,
		m: obj.modifiers,
		b: obj.baked ? obj.baked.position.length : 0
	});
}
var PRIMITIVE_DEFAULTS = {
	cube: {
		params: { size: 1 },
		label: {
			fa: "مکعب",
			en: "Cube"
		}
	},
	rounded: {
		params: {
			size: 1,
			radius: .12
		},
		label: {
			fa: "مکعب گرد",
			en: "Rounded cube"
		}
	},
	sphere: {
		params: {
			radius: .75,
			segments: 32,
			rings: 24
		},
		label: {
			fa: "کره",
			en: "UV Sphere"
		}
	},
	ico: {
		params: {
			radius: .75,
			subdiv: 1
		},
		label: {
			fa: "آیکوسفر",
			en: "Ico sphere"
		}
	},
	cylinder: {
		params: {
			radius: .5,
			depth: 1.4,
			segments: 24
		},
		label: {
			fa: "استوانه",
			en: "Cylinder"
		}
	},
	cone: {
		params: {
			radius: .6,
			depth: 1.4,
			segments: 24
		},
		label: {
			fa: "مخروط",
			en: "Cone"
		}
	},
	torus: {
		params: {
			radius: .7,
			tube: .22,
			radial: 16,
			tubular: 48
		},
		label: {
			fa: "توروس",
			en: "Torus"
		}
	},
	plane: {
		params: { size: 8 },
		label: {
			fa: "صفحه",
			en: "Plane"
		}
	},
	capsule: {
		params: {
			radius: .35,
			depth: .9
		},
		label: {
			fa: "کپسول",
			en: "Capsule"
		}
	},
	knot: {
		params: {
			radius: .7,
			tube: .22,
			tubular: 96,
			radial: 16,
			p: 2,
			q: 3
		},
		label: {
			fa: "گره",
			en: "Torus knot"
		}
	},
	gear: {
		params: {
			teeth: 16,
			radius: 1,
			depth: .22,
			hole: .22
		},
		label: {
			fa: "چرخ‌دنده",
			en: "Gear"
		}
	},
	stairs: {
		params: {
			steps: 8,
			width: 1.6,
			rise: .18,
			run: .32
		},
		label: {
			fa: "پله",
			en: "Stairs"
		}
	},
	helix: {
		params: {
			turns: 5,
			radius: .55,
			height: 2.2,
			tube: .08
		},
		label: {
			fa: "مارپیچ",
			en: "Helix"
		}
	},
	column: {
		params: {
			height: 3,
			radius: .28
		},
		label: {
			fa: "ستون",
			en: "Column"
		}
	},
	tree: {
		params: {
			height: 2.4,
			seed: 3
		},
		label: {
			fa: "درخت",
			en: "Tree"
		}
	},
	rock: {
		params: {
			radius: .7,
			seed: 4
		},
		label: {
			fa: "صخره",
			en: "Rock"
		}
	},
	vase: {
		params: {
			height: 1.6,
			radius: .45
		},
		label: {
			fa: "گلدان",
			en: "Vase"
		}
	},
	text: {
		params: {
			size: .55,
			text: "ZYNYX"
		},
		label: {
			fa: "متن سه‌بعدی",
			en: "3D text"
		}
	},
	dna: {
		params: {
			turns: 4,
			radius: .4,
			height: 2.4
		},
		label: {
			fa: "دی‌ان‌ای",
			en: "DNA"
		}
	},
	baked: {
		params: {},
		label: {
			fa: "مش واردشده",
			en: "Imported mesh"
		}
	},
	asset: {
		params: {},
		label: {
			fa: "کاراکتر / ریگ",
			en: "Character / rig"
		}
	}
};
var ENV_PRESETS = [
	"studio",
	"sunset",
	"night",
	"warehouse",
	"city",
	"dawn",
	"lobby",
	"apartment",
	"forest",
	"park"
];
function defaultMaterial(name = "Material", color = "#c5c6ca") {
	return {
		name,
		color,
		metalness: 0,
		roughness: .42,
		emissive: "#000000",
		emissiveIntensity: 0,
		transmission: 0,
		thickness: .6,
		ior: 1.5,
		clearcoat: 0,
		clearcoatRoughness: .1,
		opacity: 1,
		envMapIntensity: 1,
		iridescence: 0,
		sheen: 0,
		wireframe: false,
		flat: false
	};
}
var MATERIAL_PRESETS = {
	Default: {
		color: "#c5c6ca",
		metalness: 0,
		roughness: .42,
		transmission: 0
	},
	Gold: {
		name: "Gold",
		color: "#d4a017",
		metalness: 1,
		roughness: .22,
		clearcoat: .15
	},
	Copper: {
		name: "Copper",
		color: "#b87333",
		metalness: 1,
		roughness: .28
	},
	Chrome: {
		name: "Chrome",
		color: "#dfe3ea",
		metalness: 1,
		roughness: .08
	},
	Rubber: {
		name: "Rubber",
		color: "#2a2a2c",
		metalness: 0,
		roughness: .86
	},
	Plastic: {
		name: "Plastic",
		color: "#c23b2e",
		metalness: 0,
		roughness: .35,
		clearcoat: .55
	},
	Glass: {
		name: "Glass",
		color: "#e8f2ff",
		metalness: 0,
		roughness: .04,
		transmission: .95,
		thickness: 1.2,
		ior: 1.5,
		opacity: 1
	},
	Ceramic: {
		name: "Ceramic",
		color: "#efe6d8",
		metalness: 0,
		roughness: .28,
		clearcoat: .4
	},
	Concrete: {
		name: "Concrete",
		color: "#8a8680",
		metalness: 0,
		roughness: .92
	},
	Carbon: {
		name: "Carbon",
		color: "#1a1a1c",
		metalness: .7,
		roughness: .38
	},
	Neon: {
		name: "Neon",
		color: "#111111",
		emissive: "#e07820",
		emissiveIntensity: 3.2,
		roughness: .3
	},
	Skin: {
		name: "Skin",
		color: "#c99578",
		metalness: 0,
		roughness: .52,
		sheen: .4
	},
	Wood: {
		name: "Wood",
		color: "#6b4423",
		metalness: 0,
		roughness: .72
	},
	Pearl: {
		name: "Pearl",
		color: "#f0e6dc",
		metalness: .15,
		roughness: .18,
		iridescence: .85,
		clearcoat: .4
	}
};
function uid(prefix = "ob") {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
function asTriple(v, fallback = [
	0,
	0,
	0
]) {
	if (Array.isArray(v) && v.length >= 3) return [
		Number(v[0]) || 0,
		Number(v[1]) || 0,
		Number(v[2]) || 0
	];
	if (v && typeof v === "object") {
		const o = v;
		if (o.x !== void 0 || o.y !== void 0 || o.z !== void 0) return [
			Number(o.x) || 0,
			Number(o.y) || 0,
			Number(o.z) || 0
		];
	}
	if (typeof v === "number") return [
		v,
		v,
		v
	];
	return fallback;
}
function hexToRgb(hex) {
	const h = hex.replace("#", "");
	const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
	if (Number.isNaN(n)) return [
		.8,
		.8,
		.8
	];
	return [
		(n >> 16 & 255) / 255,
		(n >> 8 & 255) / 255,
		(n & 255) / 255
	];
}
var THREEJS = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r170/examples/models";
var SAMPLE_CHARACTERS = [
	{
		id: "soldier",
		nameFa: "سرباز",
		nameEn: "Soldier",
		format: "glb",
		url: `${THREEJS}/gltf/Soldier.glb`,
		scale: [
			1.35,
			1.35,
			1.35
		],
		position: [
			0,
			0,
			0
		],
		clip: "Walk",
		tag: "GLB · Walk/Run/Idle"
	},
	{
		id: "xbot",
		nameFa: "ایکس‌بات",
		nameEn: "X Bot",
		format: "glb",
		url: `${THREEJS}/gltf/Xbot.glb`,
		scale: [
			1.15,
			1.15,
			1.15
		],
		position: [
			0,
			0,
			0
		],
		tag: "GLB · اسکلت کامل"
	},
	{
		id: "robot",
		nameFa: "ربات بیانی",
		nameEn: "Expressive Robot",
		format: "glb",
		url: `${THREEJS}/gltf/RobotExpressive/RobotExpressive.glb`,
		scale: [
			.55,
			.55,
			.55
		],
		position: [
			0,
			0,
			0
		],
		clip: "Walking",
		tag: "GLB · ۱۲ کلیپ"
	},
	{
		id: "samba",
		nameFa: "رقاص سامبا",
		nameEn: "Samba Dancer",
		format: "fbx",
		url: `${THREEJS}/fbx/Samba%20Dancing.fbx`,
		scale: [
			.012,
			.012,
			.012
		],
		position: [
			0,
			0,
			0
		],
		tag: "FBX · Mixamo"
	},
	{
		id: "horse",
		nameFa: "اسب",
		nameEn: "Horse",
		format: "glb",
		url: `${THREEJS}/gltf/Horse.glb`,
		scale: [
			.012,
			.012,
			.012
		],
		position: [
			0,
			0,
			0
		],
		tag: "GLB · دویدن"
	},
	{
		id: "flamingo",
		nameFa: "فلامینگو",
		nameEn: "Flamingo",
		format: "glb",
		url: `${THREEJS}/gltf/Flamingo.glb`,
		scale: [
			.018,
			.018,
			.018
		],
		position: [
			0,
			1.1,
			0
		],
		tag: "GLB · پرواز"
	},
	{
		id: "parrot",
		nameFa: "طوطی",
		nameEn: "Parrot",
		format: "glb",
		url: `${THREEJS}/gltf/Parrot.glb`,
		scale: [
			.04,
			.04,
			.04
		],
		position: [
			0,
			1.4,
			0
		],
		tag: "GLB · بال زدن"
	},
	{
		id: "stork",
		nameFa: "لک‌لک",
		nameEn: "Stork",
		format: "glb",
		url: `${THREEJS}/gltf/Stork.glb`,
		scale: [
			.028,
			.028,
			.028
		],
		position: [
			0,
			1.2,
			0
		],
		tag: "GLB · پرواز"
	}
];
function assetFromSample(sample, extra) {
	return {
		id: uid("ch"),
		name: sample.nameEn,
		kind: "asset",
		visible: true,
		position: extra?.position ?? sample.position,
		rotation: extra?.rotation ?? [
			0,
			0,
			0
		],
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
		...omitPos(extra)
	};
}
function omitPos(extra) {
	if (!extra) return {};
	const { position: _p, rotation: _r, scale: _s, keyframes: _k, ...rest } = extra;
	return rest;
}
function part(name, primitive, position, scale, color, parentId, extra) {
	return {
		id: uid("mn"),
		name,
		kind: "mesh",
		visible: true,
		position,
		rotation: extra?.rotation ?? [
			0,
			0,
			0
		],
		scale,
		primitive,
		params: extra?.params ?? {},
		material: {
			...defaultMaterial(name, color),
			roughness: .48,
			sheen: .2
		},
		cameraFov: 45,
		modifiers: [],
		keyframes: extra?.keyframes ?? [],
		parentId
	};
}
function walkKeys(base, axis, amp, frames = 24) {
	const keys = [];
	const steps = 8;
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const frame = 1 + Math.round(t * (frames - 1));
		const rot = [
			0,
			0,
			0
		];
		rot[axis] = Math.sin(t * Math.PI * 2) * amp;
		keys.push({
			frame,
			position: [...base],
			rotation: rot,
			scale: [
				1,
				1,
				1
			]
		});
	}
	return keys;
}
/** Local mannequin — always available even without network. */
function buildMannequin(opts) {
	const { name, color, accent, x, bounce } = opts;
	const hips = part(`${name}.Hips`, "cube", [
		x,
		.95,
		0
	], [
		.28,
		.12,
		.16
	], color);
	const torso = part(`${name}.Torso`, "rounded", [
		0,
		.42,
		0
	], [
		.42,
		.55,
		.28
	], color, hips.id);
	const head = part(`${name}.Head`, "sphere", [
		0,
		.55,
		0
	], [
		.22,
		.26,
		.22
	], accent, torso.id, { keyframes: bounce ? [
		{
			frame: 1,
			position: [
				0,
				.55,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			]
		},
		{
			frame: 12,
			position: [
				0,
				.62,
				0
			],
			rotation: [
				0,
				.4,
				0
			],
			scale: [
				1,
				1,
				1
			]
		},
		{
			frame: 24,
			position: [
				0,
				.55,
				0
			],
			rotation: [
				0,
				.8,
				0
			],
			scale: [
				1,
				1,
				1
			]
		}
	] : walkKeys([
		0,
		.55,
		0
	], 1, .18) });
	const armL = part(`${name}.Arm.L`, "capsule", [
		-.38,
		.18,
		0
	], [
		.1,
		.42,
		.1
	], color, torso.id, {
		keyframes: walkKeys([
			-.38,
			.18,
			0
		], 0, .7),
		params: {
			radius: .5,
			depth: 1
		}
	});
	const armR = part(`${name}.Arm.R`, "capsule", [
		.38,
		.18,
		0
	], [
		.1,
		.42,
		.1
	], color, torso.id, { keyframes: walkKeys([
		.38,
		.18,
		0
	], 0, -.7) });
	const legL = part(`${name}.Leg.L`, "capsule", [
		-.12,
		-.55,
		0
	], [
		.12,
		.55,
		.12
	], color, hips.id, { keyframes: walkKeys([
		-.12,
		-.55,
		0
	], 0, -.55) });
	const legR = part(`${name}.Leg.R`, "capsule", [
		.12,
		-.55,
		0
	], [
		.12,
		.55,
		.12
	], color, hips.id, { keyframes: walkKeys([
		.12,
		-.55,
		0
	], 0, .55) });
	hips.keyframes = bounce ? [
		{
			frame: 1,
			position: [
				x,
				.95,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			]
		},
		{
			frame: 12,
			position: [
				x,
				1.08,
				0
			],
			rotation: [
				0,
				Math.PI,
				0
			],
			scale: [
				1,
				1,
				1
			]
		},
		{
			frame: 24,
			position: [
				x,
				.95,
				0
			],
			rotation: [
				0,
				Math.PI * 2,
				0
			],
			scale: [
				1,
				1,
				1
			]
		}
	] : [
		{
			frame: 1,
			position: [
				x,
				.95,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			]
		},
		{
			frame: 12,
			position: [
				x,
				1.02,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			]
		},
		{
			frame: 24,
			position: [
				x,
				.95,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			]
		}
	];
	return [
		hips,
		torso,
		head,
		armL,
		armR,
		legL,
		legR
	];
}
function mannequinPack() {
	return [
		...buildMannequin({
			name: "Hero",
			color: "#c99578",
			accent: "#e8c4a8",
			x: -2.2
		}),
		...buildMannequin({
			name: "Knight",
			color: "#6b7280",
			accent: "#d4a017",
			x: 0,
			bounce: true
		}),
		...buildMannequin({
			name: "Android",
			color: "#3d7ea6",
			accent: "#e07820",
			x: 2.2
		})
	];
}
function nameFor(kind, objects) {
	return `${kind} ${objects.filter((o) => o.name.toLowerCase().startsWith(kind.toLowerCase())).length + 1}`;
}
function meshDefaults(primitive, objects, opts) {
	const def = PRIMITIVE_DEFAULTS[primitive];
	return {
		id: uid("ob"),
		name: opts?.name ?? nameFor(def.label.en, objects),
		kind: "mesh",
		visible: true,
		position: opts?.position ?? [
			0,
			primitive === "plane" ? 0 : .5,
			0
		],
		rotation: opts?.rotation ?? [
			0,
			0,
			0
		],
		scale: opts?.scale ?? [
			1,
			1,
			1
		],
		primitive,
		params: {
			...def.params,
			...opts?.params ?? {}
		},
		material: {
			...defaultMaterial(),
			...opts?.material ?? {}
		},
		cameraFov: 45,
		modifiers: [],
		keyframes: []
	};
}
function lightObj(type, objects, position) {
	const d = {
		sun: {
			intensity: 2.4,
			color: "#fff4e5",
			pos: [
				4,
				8,
				3
			]
		},
		point: {
			intensity: 18,
			color: "#b9d4ff",
			pos: [
				-3,
				2.5,
				2
			]
		},
		spot: {
			intensity: 24,
			color: "#ffe6c9",
			pos: [
				2,
				4,
				-3
			]
		},
		area: {
			intensity: 8,
			color: "#ffffff",
			pos: [
				0,
				4,
				0
			]
		}
	}[type];
	return {
		id: uid("lg"),
		name: nameFor(type, objects),
		kind: "light",
		visible: true,
		position: position ?? d.pos,
		rotation: type === "spot" || type === "sun" ? [
			-.7,
			.4,
			0
		] : [
			0,
			0,
			0
		],
		scale: [
			1,
			1,
			1
		],
		primitive: "cube",
		params: {},
		material: defaultMaterial(),
		cameraFov: 45,
		modifiers: [],
		keyframes: [],
		light: {
			type,
			color: d.color,
			intensity: d.intensity,
			distance: type === "sun" ? 0 : 18,
			angle: .45,
			width: 2.4,
			height: 1.4,
			castShadow: type === "sun" || type === "spot"
		}
	};
}
function lookdevScene() {
	const objects = [];
	const floor = meshDefaults("plane", objects, {
		name: "Floor",
		position: [
			0,
			0,
			0
		],
		material: {
			...MATERIAL_PRESETS.Concrete,
			name: "Concrete"
		},
		params: { size: 14 }
	});
	objects.push(floor);
	const knot = meshDefaults("knot", objects, {
		name: "HeroKnot",
		position: [
			0,
			1.15,
			0
		],
		material: {
			...MATERIAL_PRESETS.Gold,
			name: "Gold"
		}
	});
	objects.push(knot);
	const glass = meshDefaults("ico", objects, {
		name: "Glass",
		position: [
			-2.15,
			.85,
			.55
		],
		material: {
			...MATERIAL_PRESETS.Glass,
			name: "Glass"
		},
		params: {
			radius: .72,
			subdiv: 2
		}
	});
	objects.push(glass);
	const chrome = meshDefaults("rounded", objects, {
		name: "Chrome",
		position: [
			2.15,
			.55,
			.45
		],
		material: {
			...MATERIAL_PRESETS.Chrome,
			name: "Chrome"
		}
	});
	objects.push(chrome);
	objects.push(lightObj("sun", objects, [
		5,
		9,
		4
	]));
	objects.push(lightObj("point", objects, [
		-4.2,
		2.6,
		2.4
	]));
	const rim = lightObj("spot", objects, [
		3.2,
		3.8,
		-4
	]);
	if (rim.light) rim.light.color = "#9eb7ff";
	objects.push(rim);
	const cam = {
		id: uid("cam"),
		name: "Camera",
		kind: "camera",
		visible: true,
		position: [
			5.6,
			3.2,
			6.4
		],
		rotation: [
			-.35,
			.65,
			0
		],
		scale: [
			1,
			1,
			1
		],
		primitive: "cube",
		params: {},
		material: defaultMaterial(),
		cameraFov: 40,
		modifiers: [],
		keyframes: []
	};
	objects.push(cam);
	return objects;
}
function emptyScene() {
	const objects = [];
	objects.push(meshDefaults("plane", objects, {
		name: "Floor",
		position: [
			0,
			0,
			0
		],
		material: {
			...MATERIAL_PRESETS.Concrete,
			name: "Concrete"
		}
	}));
	objects.push(lightObj("sun", objects));
	return objects;
}
function archScene() {
	const objects = [];
	objects.push(meshDefaults("plane", objects, {
		name: "Ground",
		position: [
			0,
			0,
			0
		],
		params: { size: 18 },
		material: {
			...MATERIAL_PRESETS.Concrete,
			name: "Stone"
		}
	}));
	objects.push(meshDefaults("column", objects, {
		name: "Column.L",
		position: [
			-1.6,
			1.5,
			0
		],
		material: {
			...MATERIAL_PRESETS.Ceramic,
			name: "Marble"
		}
	}));
	objects.push(meshDefaults("column", objects, {
		name: "Column.R",
		position: [
			1.6,
			1.5,
			0
		],
		material: {
			...MATERIAL_PRESETS.Ceramic,
			name: "Marble"
		}
	}));
	objects.push(meshDefaults("stairs", objects, {
		name: "Stairs",
		position: [
			0,
			0,
			2.2
		],
		material: {
			...MATERIAL_PRESETS.Concrete,
			color: "#9a958c"
		}
	}));
	objects.push(meshDefaults("vase", objects, {
		name: "Urn",
		position: [
			0,
			.85,
			-1.1
		],
		material: {
			...MATERIAL_PRESETS.Copper,
			name: "Copper"
		}
	}));
	objects.push(lightObj("sun", objects, [
		6,
		10,
		5
	]));
	objects.push(lightObj("area", objects, [
		0,
		5.5,
		2
	]));
	return objects;
}
var DEFAULT_CODE = `# ZYNYX Python — bpy-compatible
import bpy
from math import pi, sin, cos

# bpy.ops.mesh.primitive_gear_add(teeth=18, radius=1.1)
# bpy.context.object.material.metallic = 1.0
print("ZYNYX ready. Run a recipe or type bpy.ops...")
`;
function snapOf(s) {
	return {
		objects: JSON.parse(JSON.stringify(s.objects)),
		selectedIds: [...s.selectedIds],
		activeId: s.activeId
	};
}
var useStudio = create((set, get) => ({
	lang: "fa",
	layout: "lookdev",
	mode: "object",
	transformMode: "translate",
	shading: "material",
	showGrid: true,
	showGizmo: true,
	snap: false,
	bloom: true,
	envPreset: "studio",
	envIntensity: 1,
	objects: [],
	selectedIds: [],
	activeId: null,
	frame: 1,
	fps: 24,
	frameStart: 1,
	frameEnd: 120,
	playing: false,
	autoKey: false,
	sculpt: {
		brush: "draw",
		radius: .35,
		strength: .35
	},
	consoleLines: [{
		kind: "info",
		text: "ZYNYX Python 3 — import bpy"
	}],
	pythonCode: DEFAULT_CODE,
	renderDataUrl: null,
	renderWidth: 1920,
	renderHeight: 1080,
	renderSamples: 2,
	ssao: true,
	viewCameraId: null,
	showWelcome: true,
	showKeys: false,
	hydrated: false,
	past: [],
	future: [],
	mobileTab: "view",
	transformDragging: false,
	clipboard: [],
	viewPreset: "persp",
	focusNonce: 0,
	polyCount: 0,
	setLang: (lang) => set({ lang }),
	setLayout: (layout) => set({ layout }),
	setMode: (mode) => set({ mode }),
	setTransformMode: (transformMode) => set({ transformMode }),
	setShading: (shading) => set({ shading }),
	setShowGrid: (showGrid) => set({ showGrid }),
	setShowGizmo: (showGizmo) => set({ showGizmo }),
	setSnap: (snap) => set({ snap }),
	setBloom: (bloom) => set({ bloom }),
	setEnv: (envPreset, envIntensity) => set({
		envPreset,
		envIntensity: envIntensity ?? get().envIntensity
	}),
	setFrame: (frame) => set({ frame }),
	setPlaying: (playing) => set({ playing }),
	setAutoKey: (autoKey) => set({ autoKey }),
	setSculpt: (p) => set({ sculpt: {
		...get().sculpt,
		...p
	} }),
	setPythonCode: (pythonCode) => set({ pythonCode }),
	setRenderDataUrl: (renderDataUrl) => set({ renderDataUrl }),
	setRenderSize: (renderWidth, renderHeight) => set({
		renderWidth,
		renderHeight
	}),
	setRenderSamples: (renderSamples) => set({ renderSamples: Math.max(1, Math.min(8, Math.floor(renderSamples))) }),
	setSsao: (ssao) => set({ ssao }),
	setViewCamera: (viewCameraId) => set({ viewCameraId }),
	setShowWelcome: (showWelcome) => set({ showWelcome }),
	setShowKeys: (showKeys) => set({ showKeys }),
	setMobileTab: (mobileTab) => set({ mobileTab }),
	setHydrated: (hydrated) => set({ hydrated }),
	setTransformDragging: (transformDragging) => set({ transformDragging }),
	setViewPreset: (viewPreset) => {
		if (viewPreset === "camera") set({
			viewPreset,
			viewCameraId: get().objects.find((o) => o.kind === "camera")?.id ?? get().viewCameraId
		});
		else set({
			viewPreset,
			viewCameraId: null
		});
	},
	bumpFocus: () => set({ focusNonce: get().focusNonce + 1 }),
	setPolyCount: (polyCount) => set({ polyCount }),
	pushHistory: () => {
		const s = get();
		set({
			past: [...s.past.slice(-48), snapOf(s)],
			future: []
		});
	},
	undo: () => {
		const s = get();
		const prev = s.past[s.past.length - 1];
		if (!prev) return;
		set({
			past: s.past.slice(0, -1),
			future: [snapOf(s), ...s.future].slice(0, 48),
			objects: prev.objects,
			selectedIds: prev.selectedIds,
			activeId: prev.activeId
		});
	},
	redo: () => {
		const s = get();
		const next = s.future[0];
		if (!next) return;
		set({
			future: s.future.slice(1),
			past: [...s.past, snapOf(s)].slice(-48),
			objects: next.objects,
			selectedIds: next.selectedIds,
			activeId: next.activeId
		});
	},
	select: (id, additive) => {
		if (!id) {
			set({
				selectedIds: [],
				activeId: null
			});
			return;
		}
		if (additive) {
			const selectedIds = get().selectedIds.includes(id) ? get().selectedIds.filter((x) => x !== id) : [...get().selectedIds, id];
			set({
				selectedIds,
				activeId: selectedIds[selectedIds.length - 1] ?? null
			});
		} else set({
			selectedIds: [id],
			activeId: id
		});
	},
	clearSelection: () => set({
		selectedIds: [],
		activeId: null
	}),
	updateObject: (id, patch) => set({ objects: get().objects.map((o) => o.id === id ? {
		...o,
		...patch
	} : o) }),
	patchMaterial: (id, patch) => set({ objects: get().objects.map((o) => o.id === id ? {
		...o,
		material: {
			...o.material,
			...patch
		}
	} : o) }),
	addMesh: (primitive, opts) => {
		get().pushHistory();
		const obj = meshDefaults(primitive, get().objects, opts);
		set({
			objects: [...get().objects, obj],
			selectedIds: [obj.id],
			activeId: obj.id
		});
		return obj.id;
	},
	addLight: (type, position) => {
		get().pushHistory();
		const obj = lightObj(type, get().objects, position);
		set({
			objects: [...get().objects, obj],
			selectedIds: [obj.id],
			activeId: obj.id
		});
		return obj.id;
	},
	addCamera: (position) => {
		get().pushHistory();
		const obj = {
			id: uid("cam"),
			name: nameFor("Camera", get().objects),
			kind: "camera",
			visible: true,
			position: position ?? [
				4,
				3,
				5
			],
			rotation: [
				-.4,
				.6,
				0
			],
			scale: [
				1,
				1,
				1
			],
			primitive: "cube",
			params: {},
			material: defaultMaterial(),
			cameraFov: 45,
			modifiers: [],
			keyframes: []
		};
		set({
			objects: [...get().objects, obj],
			selectedIds: [obj.id],
			activeId: obj.id
		});
		return obj.id;
	},
	addEmpty: (position) => {
		get().pushHistory();
		const obj = {
			id: uid("em"),
			name: nameFor("Empty", get().objects),
			kind: "empty",
			visible: true,
			position: position ?? [
				0,
				1,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			primitive: "cube",
			params: {},
			material: defaultMaterial(),
			cameraFov: 45,
			modifiers: [],
			keyframes: []
		};
		set({
			objects: [...get().objects, obj],
			selectedIds: [obj.id],
			activeId: obj.id
		});
		return obj.id;
	},
	removeSelected: () => {
		const ids = new Set(get().selectedIds);
		if (!ids.size) return;
		get().pushHistory();
		set({
			objects: get().objects.filter((o) => !ids.has(o.id)),
			selectedIds: [],
			activeId: null
		});
	},
	duplicateSelected: () => {
		const s = get();
		const src = s.objects.filter((o) => s.selectedIds.includes(o.id));
		if (!src.length) return;
		s.pushHistory();
		const copies = src.map((o) => ({
			...JSON.parse(JSON.stringify(o)),
			id: uid("ob"),
			name: `${o.name}.copy`,
			position: asTriple([
				o.position[0] + .6,
				o.position[1],
				o.position[2]
			])
		}));
		set({
			objects: [...s.objects, ...copies],
			selectedIds: copies.map((c) => c.id),
			activeId: copies[copies.length - 1]?.id ?? null
		});
	},
	hideSelected: () => {
		const ids = new Set(get().selectedIds);
		set({ objects: get().objects.map((o) => ids.has(o.id) ? {
			...o,
			visible: !o.visible
		} : o) });
	},
	applyPreset: (id, preset) => {
		const p = MATERIAL_PRESETS[preset];
		if (!p) return;
		get().patchMaterial(id, {
			...p,
			name: p.name ?? preset
		});
	},
	addModifier: (id, type) => {
		get().pushHistory();
		const mod = {
			id: uid("md"),
			type,
			enabled: true,
			params: {
				subdiv: { levels: 1 },
				mirror: { axis: 0 },
				array: {
					count: 3,
					offsetX: 1.25,
					offsetY: 0,
					offsetZ: 0
				},
				solidify: { thickness: .06 },
				bevel: {
					width: .08,
					segments: 1
				},
				displace: {
					amount: .12,
					scale: 2.4,
					texture: 1
				}
			}[type]
		};
		set({ objects: get().objects.map((o) => o.id === id ? {
			...o,
			modifiers: [...o.modifiers, mod]
		} : o) });
	},
	updateModifier: (id, modId, params, enabled) => set({ objects: get().objects.map((o) => o.id !== id ? o : {
		...o,
		modifiers: o.modifiers.map((m) => m.id === modId ? {
			...m,
			params: {
				...m.params,
				...params
			},
			enabled: enabled ?? m.enabled
		} : m)
	}) }),
	removeModifier: (id, modId) => set({ objects: get().objects.map((o) => o.id === id ? {
		...o,
		modifiers: o.modifiers.filter((m) => m.id !== modId)
	} : o) }),
	insertKeyframe: (id, frame) => {
		const s = get();
		const fid = id ?? s.activeId;
		if (!fid) return;
		const obj = s.objects.find((o) => o.id === fid);
		if (!obj) return;
		const f = frame ?? s.frame;
		const keys = obj.keyframes.filter((k) => k.frame !== f);
		keys.push({
			frame: f,
			position: [...obj.position],
			rotation: [...obj.rotation],
			scale: [...obj.scale]
		});
		keys.sort((a, b) => a.frame - b.frame);
		s.updateObject(fid, { keyframes: keys });
	},
	deleteKeyframe: (id, frame) => {
		const obj = get().objects.find((o) => o.id === id);
		if (!obj) return;
		get().pushHistory();
		get().updateObject(id, { keyframes: obj.keyframes.filter((k) => k.frame !== frame) });
	},
	setFrameRange: (start, end) => set({
		frameStart: start,
		frameEnd: Math.max(start + 1, end)
	}),
	bakeObject: (id) => {
		const fid = id ?? get().activeId;
		if (!fid) return;
		const obj = get().objects.find((o) => o.id === fid);
		if (!obj || obj.kind !== "mesh") return;
		get().pushHistory();
		const geo = evaluateGeometry(obj);
		const pos = geo.getAttribute("position");
		const nrm = geo.getAttribute("normal");
		const uv = geo.getAttribute("uv");
		get().updateObject(fid, {
			primitive: "baked",
			modifiers: [],
			baked: {
				position: Array.from(pos.array),
				normal: nrm ? Array.from(nrm.array) : void 0,
				index: geo.index ? Array.from(geo.index.array) : void 0,
				uv: uv ? Array.from(uv.array) : void 0
			}
		});
		geo.dispose();
	},
	insertTurntable: (id) => {
		const s = get();
		const fid = id ?? s.activeId;
		if (!fid) return;
		const obj = s.objects.find((o) => o.id === fid);
		if (!obj) return;
		s.pushHistory();
		s.updateObject(fid, { keyframes: [{
			frame: s.frameStart,
			position: [...obj.position],
			rotation: [
				obj.rotation[0],
				0,
				obj.rotation[2]
			],
			scale: [...obj.scale]
		}, {
			frame: s.frameEnd,
			position: [...obj.position],
			rotation: [
				obj.rotation[0],
				Math.PI * 2,
				obj.rotation[2]
			],
			scale: [...obj.scale]
		}] });
		set({
			playing: true,
			frame: s.frameStart
		});
	},
	replaceScene: (objects, selectId) => {
		get().pushHistory();
		set({
			objects,
			selectedIds: selectId ? [selectId] : [],
			activeId: selectId ?? null,
			playing: false,
			frame: 1
		});
	},
	loadLookdev: () => {
		const objects = lookdevScene();
		get().replaceScene(objects, objects.find((o) => o.name === "HeroKnot")?.id ?? null);
		set({
			showWelcome: false,
			shading: "material",
			envPreset: "studio",
			layout: "lookdev"
		});
	},
	loadEmpty: () => {
		get().replaceScene(emptyScene(), null);
		set({
			showWelcome: false,
			layout: "model"
		});
	},
	loadArch: () => {
		const objects = archScene();
		get().replaceScene(objects, objects.find((o) => o.name === "Column.L")?.id ?? null);
		set({
			showWelcome: false,
			layout: "lookdev",
			envPreset: "warehouse"
		});
	},
	threePointLights: () => {
		get().pushHistory();
		const existing = get().objects.filter((o) => o.kind !== "light");
		const lights = [];
		lights.push(lightObj("sun", lights, [
			5,
			8,
			4
		]));
		lights.push(lightObj("point", lights, [
			-4,
			2.4,
			2
		]));
		lights.push(lightObj("spot", lights, [
			2.5,
			3.5,
			-4
		]));
		set({ objects: [...existing, ...lights] });
	},
	copySelected: () => {
		const s = get();
		const src = s.objects.filter((o) => s.selectedIds.includes(o.id));
		set({ clipboard: JSON.parse(JSON.stringify(src)) });
	},
	pasteClipboard: () => {
		const s = get();
		if (!s.clipboard.length) return;
		s.pushHistory();
		const copies = s.clipboard.map((o) => ({
			...JSON.parse(JSON.stringify(o)),
			id: uid("ob"),
			name: `${o.name}.paste`,
			position: asTriple([
				o.position[0] + .6,
				o.position[1],
				o.position[2] + .6
			])
		}));
		set({
			objects: [...s.objects, ...copies],
			selectedIds: copies.map((c) => c.id),
			activeId: copies[copies.length - 1]?.id ?? null
		});
	},
	parentSelected: () => {
		const s = get();
		if (s.selectedIds.length < 2) return;
		const parentId = s.activeId ?? s.selectedIds[s.selectedIds.length - 1];
		if (!parentId) return;
		s.pushHistory();
		set({ objects: s.objects.map((o) => s.selectedIds.includes(o.id) && o.id !== parentId ? {
			...o,
			parentId
		} : o) });
	},
	unparentSelected: () => {
		const ids = new Set(get().selectedIds);
		if (!ids.size) return;
		get().pushHistory();
		set({ objects: get().objects.map((o) => ids.has(o.id) ? {
			...o,
			parentId: void 0
		} : o) });
	},
	joinSelected: () => {
		const s = get();
		const meshes = s.objects.filter((o) => s.selectedIds.includes(o.id) && o.kind === "mesh");
		if (meshes.length < 2) return;
		s.pushHistory();
		const pos = [];
		const nrm = [];
		const idx = [];
		let offset = 0;
		for (const o of meshes) {
			const g = evaluateGeometry(o);
			const m = new Matrix4().compose(new Vector3(...o.position), new Quaternion().setFromEuler(new Euler(...o.rotation)), new Vector3(...o.scale));
			g.applyMatrix4(m);
			const p = g.getAttribute("position");
			const n = g.getAttribute("normal");
			for (let i = 0; i < p.count; i++) {
				pos.push(p.getX(i), p.getY(i), p.getZ(i));
				if (n) nrm.push(n.getX(i), n.getY(i), n.getZ(i));
			}
			if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(g.index.getX(i) + offset);
			else for (let i = 0; i < p.count; i++) idx.push(offset + i);
			offset += p.count;
			g.dispose();
		}
		const drop = new Set(meshes.slice(1).map((m) => m.id));
		const joined = {
			...meshes[0],
			name: `${meshes[0].name}.join`,
			position: [
				0,
				0,
				0
			],
			rotation: [
				0,
				0,
				0
			],
			scale: [
				1,
				1,
				1
			],
			primitive: "baked",
			modifiers: [],
			baked: {
				position: pos,
				normal: nrm.length ? nrm : void 0,
				index: idx
			}
		};
		set({
			objects: s.objects.filter((o) => !drop.has(o.id)).map((o) => o.id === joined.id ? joined : o),
			selectedIds: [joined.id],
			activeId: joined.id
		});
	},
	originToGeometry: () => {
		const s = get();
		const id = s.activeId;
		if (!id) return;
		const obj = s.objects.find((o) => o.id === id);
		if (!obj || obj.kind !== "mesh") return;
		s.pushHistory();
		const geo = evaluateGeometry(obj);
		geo.computeBoundingBox();
		const c = new Vector3();
		geo.boundingBox?.getCenter(c);
		geo.dispose();
		s.updateObject(id, { position: [
			obj.position[0] + c.x * obj.scale[0],
			obj.position[1] + c.y * obj.scale[1],
			obj.position[2] + c.z * obj.scale[2]
		] });
	},
	applySnapToActive: () => {
		const s = get();
		if (!s.snap) return;
		const id = s.activeId;
		if (!id) return;
		const obj = s.objects.find((o) => o.id === id);
		if (!obj) return;
		const q = (n, step) => Math.round(n / step) * step;
		s.updateObject(id, {
			position: [
				q(obj.position[0], .25),
				q(obj.position[1], .25),
				q(obj.position[2], .25)
			],
			rotation: [
				q(obj.rotation[0], Math.PI / 12),
				q(obj.rotation[1], Math.PI / 12),
				q(obj.rotation[2], Math.PI / 12)
			],
			scale: [
				Math.max(.05, q(obj.scale[0], .1)),
				Math.max(.05, q(obj.scale[1], .1)),
				Math.max(.05, q(obj.scale[2], .1))
			]
		});
	},
	appendObjects: (objs, selectId) => {
		if (!objs.length) return;
		get().pushHistory();
		set({
			objects: [...get().objects, ...objs],
			selectedIds: selectId ? [selectId] : [objs[0].id],
			activeId: selectId ?? objs[0].id,
			showWelcome: false
		});
	},
	addAsset: (obj) => {
		get().appendObjects([obj], obj.id);
		return obj.id;
	},
	setClipName: (id, clipName) => get().updateObject(id, { clipName }),
	setClipSpeed: (id, clipSpeed) => get().updateObject(id, { clipSpeed }),
	loadCharacters: () => {
		const objects = [];
		objects.push(meshDefaults("plane", objects, {
			name: "Stage",
			position: [
				0,
				0,
				0
			],
			params: { size: 18 },
			material: {
				...MATERIAL_PRESETS.Concrete,
				name: "Stage"
			}
		}));
		objects.push(lightObj("sun", objects, [
			6,
			10,
			4
		]));
		objects.push(lightObj("point", objects, [
			-4,
			3,
			2
		]));
		objects.push(lightObj("spot", objects, [
			2,
			5,
			-5
		]));
		const placed = SAMPLE_CHARACTERS.slice(0, 4).map((s, i) => assetFromSample(s, { position: [
			(i - 1.5) * 2.4,
			s.position[1],
			0
		] }));
		objects.push(...placed);
		const pack = mannequinPack();
		for (const o of pack) if (!o.parentId) o.position = [
			o.position[0],
			o.position[1],
			3.2
		];
		objects.push(...pack);
		get().replaceScene(objects, placed[0]?.id ?? null);
		set({
			showWelcome: false,
			layout: "anim",
			playing: true,
			frameStart: 1,
			frameEnd: 240,
			shading: "material",
			envPreset: "studio"
		});
	},
	loadAnimStage: () => {
		get().loadCharacters();
	},
	log: (line) => set({ consoleLines: [...get().consoleLines.slice(-200), line] }),
	clearConsole: () => set({ consoleLines: [] }),
	hydrate: (data) => set({
		...data,
		objects: data.objects ?? get().objects,
		showWelcome: data.objects?.length ? false : get().showWelcome,
		hydrated: true
	})
}));
function activeObject() {
	const s = useStudio.getState();
	return s.objects.find((o) => o.id === s.activeId);
}
function evalObjectAtFrame(obj, frame) {
	const keys = obj.keyframes;
	if (!keys.length) return {
		position: obj.position,
		rotation: obj.rotation,
		scale: obj.scale
	};
	if (frame <= keys[0].frame) {
		const k = keys[0];
		return {
			position: k.position ?? obj.position,
			rotation: k.rotation ?? obj.rotation,
			scale: k.scale ?? obj.scale
		};
	}
	const last = keys[keys.length - 1];
	if (frame >= last.frame) return {
		position: last.position ?? obj.position,
		rotation: last.rotation ?? obj.rotation,
		scale: last.scale ?? obj.scale
	};
	let i = 0;
	while (i < keys.length - 1 && keys[i + 1].frame < frame) i++;
	const a = keys[i];
	const b = keys[i + 1];
	const t = (frame - a.frame) / Math.max(1e-4, b.frame - a.frame);
	const s = t * t * (3 - 2 * t);
	const mix = (pa, pb, fb) => {
		const x = pa ?? fb;
		const y = pb ?? fb;
		return [
			x[0] + (y[0] - x[0]) * s,
			x[1] + (y[1] - x[1]) * s,
			x[2] + (y[2] - x[2]) * s
		];
	};
	return {
		position: mix(a.position, b.position, obj.position),
		rotation: mix(a.rotation, b.rotation, obj.rotation),
		scale: mix(a.scale, b.scale, obj.scale)
	};
}
var DB_NAME = "zynyx-assets";
var STORE = "files";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error ?? /* @__PURE__ */ new Error("IDB_OPEN_FAILED"));
	});
}
async function putAssetFile(id, blob, name, type) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put({
			blob,
			name,
			type
		}, id);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error ?? /* @__PURE__ */ new Error("IDB_PUT_FAILED"));
	});
}
async function getAssetRecord(id) {
	try {
		const db = await openDb();
		return await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
			req.onsuccess = () => resolve(req.result ?? null);
			req.onerror = () => reject(req.error);
		});
	} catch {
		return null;
	}
}
var urlCache = /* @__PURE__ */ new Map();
function isIdbUrl(url) {
	return url.startsWith("idb:");
}
function isDeadBlobUrl(url) {
	return url.startsWith("blob:");
}
async function resolveAssetUrl(url) {
	if (!url) throw new Error("ASSET_MISSING");
	if (isDeadBlobUrl(url)) throw new Error("ASSET_BLOB_DEAD");
	if (!isIdbUrl(url)) return url;
	const id = url.slice(4);
	const cached = urlCache.get(id);
	if (cached) return cached;
	const rec = await getAssetRecord(id);
	if (!rec) throw new Error("ASSET_MISSING");
	const obj = URL.createObjectURL(rec.blob);
	urlCache.set(id, obj);
	return obj;
}
async function storeFileAsIdb(file, name, type) {
	const id = `f_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
	const mime = type || file.type || "application/octet-stream";
	try {
		await putAssetFile(id, file, name, mime);
		return `idb:${id}`;
	} catch {
		return URL.createObjectURL(file);
	}
}
async function annotateMissingAssets(objects) {
	const next = [];
	for (const o of objects) {
		let assetUrl = o.assetUrl;
		let assetMissing = o.assetMissing ?? false;
		let mapUrl = o.material?.mapUrl;
		if (assetUrl && isDeadBlobUrl(assetUrl)) {
			assetUrl = void 0;
			assetMissing = true;
		} else if (assetUrl && isIdbUrl(assetUrl)) {
			if (!await getAssetRecord(assetUrl.slice(4))) {
				assetUrl = void 0;
				assetMissing = true;
			}
		}
		if (mapUrl && isDeadBlobUrl(mapUrl)) mapUrl = void 0;
		else if (mapUrl && isIdbUrl(mapUrl)) {
			if (!await getAssetRecord(mapUrl.slice(4))) mapUrl = void 0;
		}
		next.push({
			...o,
			assetUrl,
			assetMissing,
			material: {
				...o.material,
				mapUrl
			}
		});
	}
	return {
		objects: next,
		missing: next.filter((o) => o.assetMissing || o.kind === "asset" && !o.assetUrl).length
	};
}
function formatLoadError(err, name, lang) {
	const raw = err instanceof Error ? err.message : String(err);
	if (raw === "ASSET_MISSING" || raw === "ASSET_BLOB_DEAD") return lang === "fa" ? `${name}: فایل ذخیره‌شده پیدا نشد — دوباره ایمپورت کنید` : `${name}: saved file missing — re-import the model`;
	return lang === "fa" ? `لود ناموفق ${name}: ${raw}` : `Load failed ${name}: ${raw}`;
}
var IMPORT_ACCEPT = [
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
	".bin"
].join(",");
var cache = /* @__PURE__ */ new Map();
var lastMtl = null;
function extOf(name) {
	return name.split(".").pop()?.toLowerCase() ?? "";
}
function dirOf(url) {
	if (url.startsWith("blob:") || url.startsWith("idb:")) return "";
	const i = url.lastIndexOf("/");
	return i >= 0 ? url.slice(0, i + 1) : "";
}
var gltfReady = null;
async function getGltfLoader() {
	if (!gltfReady) gltfReady = (async () => {
		const { GLTFLoader } = await import("../_libs/three.mjs").then((n) => n.m);
		const { DRACOLoader } = await import("../_libs/three.mjs").then((n) => n._);
		const { KTX2Loader } = await import("../_libs/three.mjs").then((n) => n.p);
		const { MeshoptDecoder } = await import("../_libs/three.mjs").then((n) => n.b);
		const draco = new DRACOLoader();
		draco.setDecoderPath("/decoders/draco/gltf/");
		const ktx2 = new KTX2Loader();
		ktx2.setTranscoderPath("/decoders/basis/");
		try {
			const canvas = document.createElement("canvas");
			const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
			if (gl) {
				const renderer = new WebGLRenderer({
					canvas,
					context: gl
				});
				ktx2.detectSupport(renderer);
				renderer.dispose();
			}
		} catch {}
		const loader = new GLTFLoader();
		loader.setDRACOLoader(draco);
		loader.setKTX2Loader(ktx2);
		const decoder = MeshoptDecoder;
		if (decoder.supported !== false) {
			if (decoder.ready) await decoder.ready;
			loader.setMeshoptDecoder(MeshoptDecoder);
		}
		return loader;
	})();
	return gltfReady;
}
async function loadRuntime(url, format) {
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
async function loadRuntimeUncached(url, format) {
	const fmt = format.replace(/^\./, "").toLowerCase();
	if (fmt === "glb" || fmt === "gltf") {
		const gltf = await (await getGltfLoader()).loadAsync(url);
		return {
			root: gltf.scene,
			clips: gltf.animations ?? [],
			format: fmt
		};
	}
	if (fmt === "fbx") {
		const { FBXLoader } = await import("../_libs/three.mjs").then((n) => n.h);
		const loader = new FBXLoader();
		const resource = dirOf(url);
		if (resource) loader.setResourcePath(resource);
		const group = await loader.loadAsync(url);
		return {
			root: group,
			clips: group.animations ?? [],
			format: "fbx"
		};
	}
	if (fmt === "obj") {
		const { OBJLoader } = await import("../_libs/three.mjs").then((n) => n.d);
		const loader = new OBJLoader();
		if (lastMtl) loader.setMaterials(lastMtl);
		return {
			root: await loader.loadAsync(url),
			clips: [],
			format: "obj"
		};
	}
	if (fmt === "stl") {
		const { STLLoader } = await import("../_libs/three.mjs").then((n) => n.s);
		const geo = await new STLLoader().loadAsync(url);
		geo.computeVertexNormals();
		return {
			root: new Mesh(geo, new MeshStandardMaterial({
				color: 12961482,
				metalness: .1,
				roughness: .5
			})),
			clips: [],
			format: "stl"
		};
	}
	if (fmt === "ply") {
		const { PLYLoader } = await import("../_libs/three.mjs").then((n) => n.l);
		const geo = await new PLYLoader().loadAsync(url);
		geo.computeVertexNormals();
		return {
			root: new Mesh(geo, new MeshStandardMaterial({ vertexColors: Boolean(geo.getAttribute("color")) })),
			clips: [],
			format: "ply"
		};
	}
	if (fmt === "dae") {
		const { ColladaLoader } = await import("../_libs/three.mjs").then((n) => n.v);
		const collada = await new ColladaLoader().loadAsync(url);
		if (!collada?.scene) throw new Error("Empty Collada");
		return {
			root: collada.scene,
			clips: [],
			format: "dae"
		};
	}
	if (fmt === "3ds") {
		const { TDSLoader } = await import("../_libs/three.mjs").then((n) => n.a);
		return {
			root: await new TDSLoader().loadAsync(url),
			clips: [],
			format: "3ds"
		};
	}
	if (fmt === "3mf") {
		const { ThreeMFLoader } = await import("../_libs/three.mjs").then((n) => n.y);
		return {
			root: await new ThreeMFLoader().loadAsync(url),
			clips: [],
			format: "3mf"
		};
	}
	if (fmt === "vtk" || fmt === "vtp") {
		const { VTKLoader } = await import("../_libs/three.mjs").then((n) => n.n);
		const geo = await new VTKLoader().loadAsync(url);
		geo.computeVertexNormals();
		return {
			root: new Mesh(geo, new MeshStandardMaterial()),
			clips: [],
			format: "vtk"
		};
	}
	if (fmt === "xyz") {
		const { XYZLoader } = await import("../_libs/three.mjs").then((n) => n.t);
		const geo = await new XYZLoader().loadAsync(url);
		return {
			root: new Points(geo, new PointsMaterial({
				size: .04,
				color: 14710816
			})),
			clips: [],
			format: "xyz"
		};
	}
	if (fmt === "pcd") {
		const { PCDLoader } = await import("../_libs/three.mjs").then((n) => n.u);
		return {
			root: await new PCDLoader().loadAsync(url),
			clips: [],
			format: "pcd"
		};
	}
	if (fmt === "wrl") {
		const { VRMLLoader } = await import("../_libs/three.mjs").then((n) => n.r);
		return {
			root: await new VRMLLoader().loadAsync(url),
			clips: [],
			format: "wrl"
		};
	}
	if (fmt === "usdz") {
		const { USDZLoader } = await import("../_libs/three.mjs").then((n) => n.i);
		return {
			root: await new USDZLoader().loadAsync(url),
			clips: [],
			format: "usdz"
		};
	}
	if (fmt === "svg") {
		const { SVGLoader } = await import("../_libs/three.mjs").then((n) => n.o);
		const data = await new SVGLoader().loadAsync(url);
		const g = new Group();
		for (const p of data.paths) {
			const shapes = SVGLoader.createShapes(p);
			for (const shape of shapes) {
				const mesh = new Mesh(new ExtrudeGeometry(shape, {
					depth: 8,
					bevelEnabled: false
				}), new MeshStandardMaterial({ color: p.color }));
				g.add(mesh);
			}
		}
		g.scale.set(.01, -.01, .01);
		return {
			root: g,
			clips: [],
			format: "svg"
		};
	}
	throw new Error(`Unsupported format: ${fmt}`);
}
function meshToBaked(mesh, name) {
	const geo = mesh.geometry.clone();
	geo.applyMatrix4(mesh.matrixWorld);
	const pos = geo.getAttribute("position");
	if (!pos) return null;
	const nrm = geo.getAttribute("normal");
	const uv = geo.getAttribute("uv");
	const baked = {
		position: Array.from(pos.array),
		normal: nrm ? Array.from(nrm.array) : void 0,
		index: geo.index ? Array.from(geo.index.array) : void 0,
		uv: uv ? Array.from(uv.array) : void 0
	};
	const world = new Vector3();
	mesh.getWorldPosition(world);
	const color = mesh.material && !Array.isArray(mesh.material) && "color" in mesh.material ? "#" + mesh.material.color.getHexString() : "#c5c6ca";
	return {
		id: uid("im"),
		name: mesh.name || name,
		kind: "mesh",
		visible: true,
		position: [
			world.x,
			world.y,
			world.z
		],
		rotation: [
			0,
			0,
			0
		],
		scale: [
			1,
			1,
			1
		],
		primitive: "baked",
		params: {},
		material: { ...defaultMaterial(mesh.name || "Imported", color) },
		cameraFov: 45,
		modifiers: [],
		keyframes: [],
		baked
	};
}
function fitAssetScale(root, format) {
	const size = new Box3().setFromObject(root).getSize(new Vector3());
	const maxDim = Math.max(size.x, size.y, size.z);
	if (!Number.isFinite(maxDim) || maxDim <= 0) return format === "fbx" ? [
		.012,
		.012,
		.012
	] : [
		1,
		1,
		1
	];
	if (maxDim > 8 || maxDim < .35) {
		const s = 1.75 / maxDim;
		return [
			s,
			s,
			s
		];
	}
	return [
		1,
		1,
		1
	];
}
function makeAssetObject(name, url, format, clips, scale) {
	return {
		id: uid("as"),
		name,
		kind: "asset",
		visible: true,
		position: [
			0,
			0,
			0
		],
		rotation: [
			0,
			0,
			0
		],
		scale: scale ?? (format === "fbx" ? [
			.012,
			.012,
			.012
		] : [
			1,
			1,
			1
		]),
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
		assetMissing: false
	};
}
async function importAnyFile(file) {
	const fmt = extOf(file.name);
	const st = useStudio.getState();
	const fail = (err) => {
		const msg = formatLoadError(err, file.name, st.lang);
		st.log({
			kind: "err",
			text: msg
		});
		throw new Error(msg);
	};
	if (fmt === "json") {
		const text = await file.text();
		const data = JSON.parse(text);
		if (!Array.isArray(data.objects)) throw new Error("Invalid project");
		useStudio.getState().hydrate({
			objects: data.objects,
			lang: data.lang,
			pythonCode: data.pythonCode,
			envPreset: data.envPreset,
			shading: data.shading
		});
		useStudio.getState().setShowWelcome(false);
		return;
	}
	if ([
		"png",
		"jpg",
		"jpeg",
		"webp"
	].includes(fmt)) {
		const id = st.activeId;
		if (!id) throw new Error(st.lang === "fa" ? "ابتدا یک مش انتخاب کنید تا بافت اعمال شود" : "Select a mesh to apply the texture");
		const url = await storeFileAsIdb(file, file.name, file.type);
		st.patchMaterial(id, { mapUrl: url });
		return;
	}
	if (fmt === "hdr" || fmt === "exr") {
		const resolved = await resolveAssetUrl(await storeFileAsIdb(file, file.name, file.type));
		const { RGBELoader } = await import("../_libs/three.mjs").then((n) => n.c);
		const { EXRLoader } = await import("../_libs/three.mjs").then((n) => n.g);
		const tex = await (fmt === "hdr" ? new RGBELoader() : new EXRLoader()).loadAsync(resolved);
		tex.mapping = 303;
		st.log({
			kind: "info",
			text: `HDRI loaded: ${file.name}`
		});
		st.setEnv("studio");
		globalThis.__zynyxHdr = tex;
		return;
	}
	if (fmt === "mtl") {
		const text = await file.text();
		const { MTLLoader } = await import("../_libs/three.mjs").then((n) => n.f);
		const creator = new MTLLoader().parse(text, "");
		creator.preload();
		lastMtl = creator;
		st.log({
			kind: "info",
			text: st.lang === "fa" ? `MTL آماده شد: ${file.name} — حالا OBJ را ایمپورت کنید` : `MTL ready: ${file.name} — import the OBJ next`
		});
		return;
	}
	const keepRig = [
		"glb",
		"gltf",
		"fbx",
		"dae",
		"usdz"
	].includes(fmt);
	const stored = await storeFileAsIdb(file, file.name, file.type);
	try {
		const loaded = await loadRuntime(stored, fmt);
		if (keepRig) {
			const clips = loaded.clips.map((c) => c.name || "clip");
			const obj = makeAssetObject(file.name.replace(/\.[^.]+$/, ""), stored, fmt, clips, fitAssetScale(loaded.root, fmt));
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
		const added = [];
		loaded.root.traverse((node) => {
			const mesh = node;
			if (mesh.isMesh) {
				const baked = meshToBaked(mesh, file.name.replace(/\.[^.]+$/, ""));
				if (baked) added.push(baked);
			}
		});
		if (!added.length) {
			const obj = makeAssetObject(file.name.replace(/\.[^.]+$/, ""), stored, fmt, [], fitAssetScale(loaded.root, fmt));
			st.appendObjects([obj], obj.id);
			return;
		}
		st.appendObjects(added, added[0]?.id ?? null);
	} catch (err) {
		fail(err);
	}
}
function downloadBlob(filename, blob) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function downloadDataUrl(filename, dataUrl) {
	const a = document.createElement("a");
	a.href = dataUrl;
	a.download = filename;
	a.click();
}
function downloadText(filename, text, mime = "text/plain") {
	downloadBlob(filename, new Blob([text], { type: mime }));
}
function meshFromObject(obj) {
	if (obj.kind === "mesh") {
		const geo = evaluateGeometry(obj);
		const mat = new MeshStandardMaterial({
			color: obj.material.color,
			metalness: obj.material.metalness,
			roughness: obj.material.roughness,
			emissive: obj.material.emissive,
			emissiveIntensity: obj.material.emissiveIntensity,
			opacity: obj.material.opacity,
			transparent: obj.material.opacity < .999,
			flatShading: obj.material.flat
		});
		const mesh = new Mesh(geo, mat);
		mesh.name = obj.name;
		mesh.position.set(...obj.position);
		mesh.rotation.set(...obj.rotation);
		mesh.scale.set(...obj.scale);
		return mesh;
	}
	if (obj.kind === "light" && obj.light) {
		const g = new Group();
		g.name = obj.name;
		g.position.set(...obj.position);
		g.rotation.set(...obj.rotation);
		return g;
	}
	if (obj.kind === "camera") {
		const cam = new PerspectiveCamera(obj.cameraFov, 16 / 9, .1, 200);
		cam.name = obj.name;
		cam.position.set(...obj.position);
		cam.rotation.set(...obj.rotation);
		return cam;
	}
	return null;
}
async function exportSceneGlb(filename = "zynyx.glb") {
	const root = new Group();
	root.name = "ZYNYX";
	const animations = [];
	const s = useStudio.getState();
	for (const obj of s.objects) {
		if (!obj.visible) continue;
		if ((obj.kind === "asset" || obj.primitive === "asset") && obj.assetUrl && obj.assetFormat) {
			try {
				const loaded = await loadRuntime(obj.assetUrl, obj.assetFormat);
				const clone$1 = clone(loaded.root);
				clone$1.name = obj.name;
				clone$1.position.set(...obj.position);
				clone$1.rotation.set(...obj.rotation);
				clone$1.scale.set(...obj.scale);
				root.add(clone$1);
				for (const clip of loaded.clips) {
					const c = clip.clone();
					if (animations.some((a) => a.name === c.name)) c.name = `${obj.name}_${c.name || "clip"}`;
					animations.push(c);
				}
			} catch (err) {
				s.log({
					kind: "err",
					text: String(err)
				});
			}
			continue;
		}
		const node = meshFromObject(obj);
		if (node) root.add(node);
	}
	const exporter = new GLTFExporter();
	await new Promise((resolve, reject) => {
		exporter.parse(root, (res) => {
			if (res instanceof ArrayBuffer) downloadBlob(filename, new Blob([res], { type: "model/gltf-binary" }));
			else downloadText(filename.replace(/\.glb$/, ".gltf"), JSON.stringify(res, null, 2), "model/gltf+json");
			resolve();
		}, (err) => {
			s.log({
				kind: "err",
				text: String(err)
			});
			reject(err);
		}, {
			binary: true,
			animations
		});
	});
}
function rgbTuple(hex) {
	const [r, g, b] = hexToRgb(hex);
	return `(${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}, 1)`;
}
function exportBlenderPython() {
	const s = useStudio.getState();
	const lines = [
		"# ZYNYX → Blender 4.x",
		"# Y-up (ZYNYX) is converted to Z-up (Blender).",
		"import bpy",
		"from mathutils import Euler",
		"",
		"bpy.ops.object.select_all(action='SELECT')",
		"bpy.ops.object.delete(use_global=False)",
		""
	];
	const primMap = {
		cube: "bpy.ops.mesh.primitive_cube_add(size={size})",
		sphere: "bpy.ops.mesh.primitive_uv_sphere_add(radius={radius}, segments={segments}, ring_count={rings})",
		ico: "bpy.ops.mesh.primitive_ico_sphere_add(radius={radius}, subdivisions={subdiv})",
		cylinder: "bpy.ops.mesh.primitive_cylinder_add(radius={radius}, depth={depth})",
		cone: "bpy.ops.mesh.primitive_cone_add(radius1={radius}, depth={depth})",
		torus: "bpy.ops.mesh.primitive_torus_add(major_radius={radius}, minor_radius={tube})",
		plane: "bpy.ops.mesh.primitive_plane_add(size={size})",
		capsule: "bpy.ops.mesh.primitive_cylinder_add(radius={radius}, depth={depth})"
	};
	for (const obj of s.objects) {
		const [x, y, z] = obj.position;
		const loc = `(${x.toFixed(4)}, ${(-z).toFixed(4)}, ${y.toFixed(4)})`;
		const rot = `(${obj.rotation[0].toFixed(4)}, ${obj.rotation[2].toFixed(4)}, ${obj.rotation[1].toFixed(4)})`;
		if (obj.kind === "mesh") {
			const tmpl = primMap[obj.primitive];
			if (tmpl) {
				let call = tmpl;
				for (const [k, v] of Object.entries(obj.params)) call = call.replaceAll(`{${k}}`, String(v));
				call = call.replace(/\{[a-zA-Z]+\}/g, "1");
				lines.push(`${call.split("(")[0]}(${call.split("(")[1]?.replace(/\)$/, "")}, location=${loc})`.replace(", ,", ","));
				lines.push(`obj = bpy.context.object`);
			} else {
				lines.push(`bpy.ops.mesh.primitive_cube_add(location=${loc})`);
				lines.push(`obj = bpy.context.object`);
				lines.push(`# generator: ${obj.primitive} — refine in ZYNYX or replace with Geometry Nodes`);
			}
			lines.push(`obj.name = ${JSON.stringify(obj.name)}`);
			lines.push(`obj.rotation_euler = Euler(${rot}, 'XYZ')`);
			lines.push(`obj.scale = (${obj.scale.join(", ")})`);
			lines.push(`mat = bpy.data.materials.new(${JSON.stringify(obj.material.name)})`);
			lines.push(`mat.use_nodes = True`);
			lines.push(`bsdf = mat.node_tree.nodes.get('Principled BSDF')`);
			lines.push(`if bsdf:`);
			lines.push(`    bsdf.inputs['Base Color'].default_value = ${rgbTuple(obj.material.color)}`);
			lines.push(`    bsdf.inputs['Metallic'].default_value = ${obj.material.metalness}`);
			lines.push(`    bsdf.inputs['Roughness'].default_value = ${obj.material.roughness}`);
			if (obj.material.transmission > .01) lines.push(`    bsdf.inputs['Transmission Weight'].default_value = ${obj.material.transmission}`);
			lines.push(`obj.data.materials.append(mat)`);
			for (const m of obj.modifiers) {
				if (!m.enabled) continue;
				if (m.type === "subdiv") lines.push(`bpy.ops.object.modifier_add(type='SUBSURF')`);
				if (m.type === "mirror") lines.push(`bpy.ops.object.modifier_add(type='MIRROR')`);
				if (m.type === "array") lines.push(`bpy.ops.object.modifier_add(type='ARRAY')`);
				if (m.type === "solidify") lines.push(`bpy.ops.object.modifier_add(type='SOLIDIFY')`);
				if (m.type === "bevel") lines.push(`bpy.ops.object.modifier_add(type='BEVEL')`);
				if (m.type === "displace") lines.push(`bpy.ops.object.modifier_add(type='DISPLACE')`);
			}
			lines.push("");
		} else if (obj.kind === "light" && obj.light) {
			lines.push(`bpy.ops.object.light_add(type='${{
				sun: "SUN",
				point: "POINT",
				spot: "SPOT",
				area: "AREA"
			}[obj.light.type]}', location=${loc})`);
			lines.push(`lamp = bpy.context.object`);
			lines.push(`lamp.name = ${JSON.stringify(obj.name)}`);
			lines.push(`lamp.data.energy = ${obj.light.intensity * (obj.light.type === "sun" ? 40 : 80)}`);
			lines.push("");
		} else if (obj.kind === "camera") {
			lines.push(`bpy.ops.object.camera_add(location=${loc})`);
			lines.push(`cam = bpy.context.object`);
			lines.push(`cam.name = ${JSON.stringify(obj.name)}`);
			lines.push(`bpy.context.scene.camera = cam`);
			lines.push("");
		} else if (obj.kind === "asset") {
			lines.push(`# asset ${JSON.stringify(obj.name)} format=${obj.assetFormat ?? "?"} — import original file in Blender`);
			lines.push("");
		}
	}
	lines.push(`print("ZYNYX scene imported:", ${s.objects.length}, "objects")`);
	return lines.join("\n");
}
function exportProjectJson() {
	const s = useStudio.getState();
	downloadText("zynyx-project.json", JSON.stringify({
		version: 1,
		objects: s.objects,
		lang: s.lang,
		envPreset: s.envPreset,
		pythonCode: s.pythonCode,
		shading: s.shading
	}, null, 2), "application/json");
}
async function importProjectJson(file) {
	const text = await file.text();
	const data = JSON.parse(text);
	if (!Array.isArray(data.objects)) throw new Error("Invalid project");
	useStudio.getState().hydrate({
		objects: data.objects,
		lang: data.lang,
		pythonCode: data.pythonCode,
		envPreset: data.envPreset,
		shading: data.shading
	});
	useStudio.getState().setShowWelcome(false);
}
function captureRender(gl, scene, camera, width = 1920, height = 1080) {
	const canvas = gl.domElement;
	const prevW = canvas.width;
	const prevH = canvas.height;
	const dpr = gl.getPixelRatio();
	gl.setPixelRatio(1);
	gl.setSize(width, height, false);
	gl.render(scene, camera);
	const url = canvas.toDataURL("image/png");
	gl.setPixelRatio(dpr);
	gl.setSize(prevW / dpr, prevH / dpr, false);
	return url;
}
var dict = {
	app: {
		fa: "زینیکس",
		en: "ZYNYX"
	},
	tagline: {
		fa: "استودیوی سه‌بعدی حرفه‌ای",
		en: "Professional 3D studio"
	},
	file: {
		fa: "فایل",
		en: "File"
	},
	edit: {
		fa: "ویرایش",
		en: "Edit"
	},
	add: {
		fa: "افزودن",
		en: "Add"
	},
	object: {
		fa: "آبجکت",
		en: "Object"
	},
	mesh: {
		fa: "مش",
		en: "Mesh"
	},
	modifiers: {
		fa: "مودیفایر",
		en: "Modifiers"
	},
	lighting: {
		fa: "نور",
		en: "Lighting"
	},
	animation: {
		fa: "انیمیشن",
		en: "Animation"
	},
	render: {
		fa: "رندر",
		en: "Render"
	},
	script: {
		fa: "پایتون",
		en: "Python"
	},
	help: {
		fa: "راهنما",
		en: "Help"
	},
	newScene: {
		fa: "صحنه جدید",
		en: "New scene"
	},
	lookdev: {
		fa: "لوک‌دو محصول",
		en: "Product lookdev"
	},
	exportGltf: {
		fa: "خروجی GLB",
		en: "Export GLB"
	},
	exportPy: {
		fa: "خروجی اسکریپت بلندر",
		en: "Export Blender Python"
	},
	exportPng: {
		fa: "خروجی PNG",
		en: "Export PNG"
	},
	exportJson: {
		fa: "خروجی پروژه JSON",
		en: "Export project JSON"
	},
	importJson: {
		fa: "ورود پروژه JSON",
		en: "Import project JSON"
	},
	importGltf: {
		fa: "ورود مدل (همه فرمت‌ها)",
		en: "Import model (all formats)"
	},
	importFbx: {
		fa: "ورود FBX / کاراکتر",
		en: "Import FBX / character"
	},
	characters: {
		fa: "کاراکترها",
		en: "Characters"
	},
	sampleChars: {
		fa: "نمونه‌های آماده",
		en: "Ready samples"
	},
	mannequins: {
		fa: "مانکن‌های استودیو",
		en: "Studio mannequins"
	},
	clip: {
		fa: "کلیپ انیمیشن",
		en: "Animation clip"
	},
	clipSpeed: {
		fa: "سرعت کلیپ",
		en: "Clip speed"
	},
	startChars: {
		fa: "صحنه کاراکتر",
		en: "Character stage"
	},
	formatsHint: {
		fa: "GLB, GLTF, FBX, OBJ, STL, PLY, DAE, 3DS, 3MF, USDZ, HDR و تصویر",
		en: "GLB, GLTF, FBX, OBJ, STL, PLY, DAE, 3DS, 3MF, USDZ, HDR and images"
	},
	welcomeBody: {
		fa: "مدل‌سازی، کاراکترهای آماده با انیمیشن، پشتیبانی کامل FBX و ده‌ها فرمت، متریال فیزیکی، اسکالپت، رندر و پایتون bpy — همه در مرورگر.",
		en: "Modeling, ready animated characters, full FBX and dozens of formats, physical materials, sculpt, render, and bpy Python — in the browser."
	},
	undo: {
		fa: "بازگردانی",
		en: "Undo"
	},
	redo: {
		fa: "ازنو",
		en: "Redo"
	},
	delete: {
		fa: "حذف",
		en: "Delete"
	},
	duplicate: {
		fa: "تکثیر",
		en: "Duplicate"
	},
	hide: {
		fa: "پنهان",
		en: "Hide"
	},
	scene: {
		fa: "صحنه",
		en: "Scene"
	},
	properties: {
		fa: "ویژگی‌ها",
		en: "Properties"
	},
	outliner: {
		fa: "اوت‌لاینر",
		en: "Outliner"
	},
	material: {
		fa: "متریال",
		en: "Material"
	},
	world: {
		fa: "جهان",
		en: "World"
	},
	transform: {
		fa: "ترانسفورم",
		en: "Transform"
	},
	location: {
		fa: "موقعیت",
		en: "Location"
	},
	rotation: {
		fa: "چرخش",
		en: "Rotation"
	},
	scale: {
		fa: "مقیاس",
		en: "Scale"
	},
	shadeSmooth: {
		fa: "سایه نرم",
		en: "Shade smooth"
	},
	shadeFlat: {
		fa: "سایه تخت",
		en: "Shade flat"
	},
	addModifier: {
		fa: "افزودن مودیفایر",
		en: "Add modifier"
	},
	runScript: {
		fa: "اجرای اسکریپت",
		en: "Run script"
	},
	recipes: {
		fa: "دستورهای حرفه‌ای",
		en: "Pro recipes"
	},
	play: {
		fa: "پخش",
		en: "Play"
	},
	keyframe: {
		fa: "کی‌فریم",
		en: "Keyframe"
	},
	autoKey: {
		fa: "اتوکی",
		en: "Auto key"
	},
	sculpt: {
		fa: "اسکالپت",
		en: "Sculpt"
	},
	objectMode: {
		fa: "آبجکت",
		en: "Object"
	},
	wire: {
		fa: "سیم",
		en: "Wire"
	},
	solid: {
		fa: "توپر",
		en: "Solid"
	},
	rendered: {
		fa: "رندر",
		en: "Rendered"
	},
	studio: {
		fa: "استودیو",
		en: "Studio"
	},
	welcomeTitle: {
		fa: "استودیوی گرافیک سه‌بعدی",
		en: "Professional 3D DCC"
	},
	startLookdev: {
		fa: "شروع با لوک‌دو",
		en: "Start with lookdev"
	},
	startEmpty: {
		fa: "صحنه خالی",
		en: "Empty scene"
	},
	startArch: {
		fa: "معماری",
		en: "Architecture"
	},
	startScript: {
		fa: "از روی پایتون",
		en: "Start from Python"
	},
	continue: {
		fa: "ادامه پروژه",
		en: "Continue project"
	},
	shortcuts: {
		fa: "میانبرها",
		en: "Shortcuts"
	},
	selected: {
		fa: "انتخاب‌شده",
		en: "Selected"
	},
	nothing: {
		fa: "چیزی انتخاب نشده — جهان",
		en: "Nothing selected — World"
	},
	intensity: {
		fa: "شدت",
		en: "Intensity"
	},
	color: {
		fa: "رنگ",
		en: "Color"
	},
	metalness: {
		fa: "فلزی",
		en: "Metalness"
	},
	roughness: {
		fa: "زبری",
		en: "Roughness"
	},
	transmission: {
		fa: "عبور نور",
		en: "Transmission"
	},
	clearcoat: {
		fa: "کلیرکوت",
		en: "Clearcoat"
	},
	visible: {
		fa: "نمایان",
		en: "Visible"
	},
	name: {
		fa: "نام",
		en: "Name"
	},
	type: {
		fa: "نوع",
		en: "Type"
	},
	brush: {
		fa: "براش",
		en: "Brush"
	},
	radius: {
		fa: "شعاع",
		en: "Radius"
	},
	strength: {
		fa: "قدرت",
		en: "Strength"
	},
	environment: {
		fa: "محیط",
		en: "Environment"
	},
	bloom: {
		fa: "بلوم",
		en: "Bloom"
	},
	grid: {
		fa: "گرید",
		en: "Grid"
	},
	gizmo: {
		fa: "گیزمو",
		en: "Gizmo"
	},
	snap: {
		fa: "اسنپ",
		en: "Snap"
	},
	layoutModel: {
		fa: "مدل",
		en: "Model"
	},
	layoutLookdev: {
		fa: "لوک‌دو",
		en: "Lookdev"
	},
	layoutAnim: {
		fa: "انیم",
		en: "Anim"
	},
	layoutScript: {
		fa: "اسکریپت",
		en: "Script"
	},
	layoutRender: {
		fa: "رندر",
		en: "Render"
	},
	renderStill: {
		fa: "رندر فریم",
		en: "Render still"
	},
	close: {
		fa: "بستن",
		en: "Close"
	},
	download: {
		fa: "دانلود",
		en: "Download"
	},
	console: {
		fa: "کنسول",
		en: "Console"
	},
	objects: {
		fa: "آبجکت‌ها",
		en: "Objects"
	},
	lights: {
		fa: "نورها",
		en: "Lights"
	},
	cameras: {
		fa: "دوربین",
		en: "Cameras"
	},
	generators: {
		fa: "ژنراتور",
		en: "Generators"
	},
	primitives: {
		fa: "پریمیتیو",
		en: "Primitives"
	},
	presets: {
		fa: "پیش‌تنظیم",
		en: "Presets"
	},
	threePoint: {
		fa: "نور سه‌نقطه",
		en: "Three-point light"
	},
	turntable: {
		fa: "ترن‌تیبل",
		en: "Turntable"
	},
	clearScene: {
		fa: "پاک کردن صحنه",
		en: "Clear scene"
	},
	confirmClear: {
		fa: "صحنه پاک شود؟",
		en: "Clear the scene?"
	},
	copy: {
		fa: "کپی",
		en: "Copy"
	},
	paste: {
		fa: "چسباندن",
		en: "Paste"
	},
	parent: {
		fa: "والد",
		en: "Parent"
	},
	unparent: {
		fa: "جدا از والد",
		en: "Clear parent"
	},
	join: {
		fa: "ادغام مش",
		en: "Join meshes"
	},
	origin: {
		fa: "مبدأ به هندسه",
		en: "Origin to geometry"
	},
	focus: {
		fa: "فوکوس",
		en: "Focus"
	},
	viewCam: {
		fa: "دید از دوربین",
		en: "Camera view"
	},
	viewPersp: {
		fa: "پرسپکتیو",
		en: "Perspective"
	},
	viewFront: {
		fa: "نما جلو",
		en: "Front"
	},
	viewTop: {
		fa: "نما بالا",
		en: "Top"
	},
	viewRight: {
		fa: "نما راست",
		en: "Right"
	},
	texture: {
		fa: "بافت",
		en: "Texture"
	},
	parentTo: {
		fa: "والد کردن",
		en: "Parent to last"
	},
	bake: {
		fa: "بیک مش",
		en: "Bake mesh"
	},
	fov: {
		fa: "زاویه دید",
		en: "FOV"
	},
	distance: {
		fa: "فاصله",
		en: "Distance"
	},
	angle: {
		fa: "زاویه",
		en: "Angle"
	},
	shadows: {
		fa: "سایه",
		en: "Shadows"
	},
	opacity: {
		fa: "شفافیت",
		en: "Opacity"
	},
	sheen: {
		fa: "شین",
		en: "Sheen"
	},
	iridescence: {
		fa: "رنگین‌کمان",
		en: "Iridescence"
	},
	envStrength: {
		fa: "شدت HDRI",
		en: "HDRI strength"
	},
	samples: {
		fa: "نمونه‌ها",
		en: "Samples"
	},
	reimport: {
		fa: "دوباره ایمپورت کنید",
		en: "Re-import required"
	}
};
function t(lang, key) {
	return dict[key][lang];
}
function tokenize(src) {
	const tokens = [];
	const lines = src.replace(/\t/g, "    ").replace(/\r/g, "").split("\n");
	const stack = [0];
	for (let li = 0; li < lines.length; li++) {
		let line = lines[li] ?? "";
		const hash = line.indexOf("#");
		if (hash >= 0) {
			const before = line.slice(0, hash);
			if ((before.match(/["']/g) ?? []).length % 2 === 0) line = before;
		}
		if (line.trim() === "") continue;
		const indent = line.match(/^ */)?.[0].length ?? 0;
		if (indent > stack[stack.length - 1]) {
			stack.push(indent);
			tokens.push({ t: "indent" });
		} else while (indent < stack[stack.length - 1]) {
			stack.pop();
			tokens.push({ t: "dedent" });
		}
		let i = indent;
		const s = line;
		while (i < s.length) {
			const c = s[i];
			if (c === " ") {
				i++;
				continue;
			}
			if (c === "\"" || c === "'") {
				const q = c;
				i++;
				let out = "";
				while (i < s.length && s[i] !== q) if (s[i] === "\\" && i + 1 < s.length) {
					const n = s[i + 1];
					out += n === "n" ? "\n" : n === "t" ? "	" : n;
					i += 2;
				} else {
					out += s[i];
					i++;
				}
				i++;
				tokens.push({
					t: "str",
					v: out
				});
				continue;
			}
			if (/[0-9]/.test(c) || c === "." && /[0-9]/.test(s[i + 1] ?? "")) {
				const m = s.slice(i).match(/^[0-9]*\.?[0-9]+([eE][+-]?[0-9]+)?/);
				tokens.push({
					t: "num",
					v: parseFloat(m[0])
				});
				i += m[0].length;
				continue;
			}
			if (/[A-Za-z_\u00c0-\uffff]/.test(c)) {
				const m = s.slice(i).match(/^[A-Za-z_\u00c0-\uffff][A-Za-z0-9_]*/);
				tokens.push({
					t: "name",
					v: m[0]
				});
				i += m[0].length;
				continue;
			}
			const two = s.slice(i, i + 2);
			if ([
				"**",
				"//",
				"==",
				"!=",
				"<=",
				">=",
				"+=",
				"-=",
				"*=",
				"/="
			].includes(two)) {
				tokens.push({
					t: "op",
					v: two
				});
				i += 2;
				continue;
			}
			tokens.push({
				t: "op",
				v: c
			});
			i++;
		}
		tokens.push({ t: "nl" });
	}
	while (stack.length > 1) {
		stack.pop();
		tokens.push({ t: "dedent" });
	}
	tokens.push({ t: "eof" });
	return tokens;
}
var Parser = class {
	i = 0;
	toks;
	constructor(toks) {
		this.toks = toks;
	}
	cur() {
		return this.toks[this.i] ?? { t: "eof" };
	}
	eat(t, v) {
		const c = this.cur();
		if (t && c.t !== t) throw new SyntaxError(`expected ${t}, got ${c.t}`);
		if (v && (c.t === "op" || c.t === "name") && c.v !== v) throw new SyntaxError(`expected ${v}`);
		this.i++;
		return c;
	}
	skipNl() {
		while (this.cur().t === "nl") this.i++;
	}
	isOp(v) {
		const c = this.cur();
		return c.t === "op" && c.v === v;
	}
	isName(v) {
		const c = this.cur();
		return c.t === "name" && c.v === v;
	}
	file() {
		const body = [];
		this.skipNl();
		while (this.cur().t !== "eof") {
			body.push(this.stmt());
			this.skipNl();
		}
		return body;
	}
	stmt() {
		if (this.isName("if")) return this.ifStmt();
		if (this.isName("for")) return this.forStmt();
		if (this.isName("while")) return this.whileStmt();
		if (this.isName("def")) return this.defStmt();
		if (this.isName("class")) return this.classStmt();
		if (this.isName("try")) return this.tryStmt();
		if (this.isName("raise")) {
			this.eat("name");
			if (this.cur().t === "nl" || this.cur().t === "dedent" || this.isOp(";")) return {
				k: "raise",
				x: null
			};
			return {
				k: "raise",
				x: this.expr()
			};
		}
		if (this.isName("return")) {
			this.eat("name");
			if (this.cur().t === "nl" || this.cur().t === "dedent" || this.isOp(";")) return {
				k: "return",
				x: null
			};
			return {
				k: "return",
				x: this.expr()
			};
		}
		if (this.isName("pass")) {
			this.eat("name");
			return { k: "pass" };
		}
		if (this.isName("break")) {
			this.eat("name");
			return { k: "break" };
		}
		if (this.isName("continue")) {
			this.eat("name");
			return { k: "continue" };
		}
		if (this.isName("import")) {
			this.eat("name");
			const n = this.eat("name").v;
			let asName;
			if (this.isName("as")) {
				this.eat("name");
				asName = this.eat("name").v;
			}
			return {
				k: "import",
				name: n,
				as: asName
			};
		}
		if (this.isName("from")) {
			this.eat("name");
			const parts = [this.eat("name").v];
			while (this.isOp(".")) {
				this.eat("op");
				parts.push(this.eat("name").v);
			}
			const mod = parts.join(".");
			if (!this.isName("import")) throw new SyntaxError("from ... import");
			this.eat("name");
			if (this.isOp("*")) {
				this.eat("op");
				return {
					k: "from",
					mod,
					names: "*"
				};
			}
			const names = [this.eat("name").v];
			while (this.isOp(",")) {
				this.eat("op");
				names.push(this.eat("name").v);
			}
			return {
				k: "from",
				mod,
				names
			};
		}
		const x = this.expr();
		if (this.isOp(",")) {
			const xs = [x];
			while (this.isOp(",")) {
				this.eat("op");
				if (this.isOp("=") || this.cur().t === "nl" || this.cur().t === "dedent") break;
				xs.push(this.expr());
			}
			const target = {
				k: "tuple",
				xs
			};
			if (this.isOp("=") || this.isOp("+=") || this.isOp("-=") || this.isOp("*=") || this.isOp("/=")) {
				const op = this.eat("op").v;
				return {
					k: "assign",
					target,
					value: this.tupleOrExpr(),
					op: op === "=" ? void 0 : op[0]
				};
			}
			return {
				k: "expr",
				x: target
			};
		}
		const c = this.cur();
		if (c.t === "op" && [
			"=",
			"+=",
			"-=",
			"*=",
			"/="
		].includes(c.v)) {
			const op = c.v;
			this.eat("op");
			return {
				k: "assign",
				target: x,
				value: this.tupleOrExpr(),
				op: op === "=" ? void 0 : op[0]
			};
		}
		return {
			k: "expr",
			x
		};
	}
	tupleOrExpr() {
		const first = this.expr();
		if (!this.isOp(",")) return first;
		const xs = [first];
		while (this.isOp(",")) {
			this.eat("op");
			if (this.cur().t === "nl" || this.cur().t === "dedent" || this.cur().t === "eof") break;
			xs.push(this.expr());
		}
		return {
			k: "tuple",
			xs
		};
	}
	suite() {
		if (this.isOp(":")) this.eat("op");
		this.skipNl();
		if (this.cur().t !== "indent") return [this.stmt()];
		this.eat("indent");
		const body = [];
		while (this.cur().t !== "dedent" && this.cur().t !== "eof") {
			this.skipNl();
			if (this.cur().t === "dedent" || this.cur().t === "eof") break;
			body.push(this.stmt());
			this.skipNl();
		}
		if (this.cur().t === "dedent") this.eat("dedent");
		return body;
	}
	ifStmt() {
		const arms = [];
		this.eat("name");
		const test = this.expr();
		arms.push({
			test,
			body: this.suite()
		});
		this.skipNl();
		while (this.isName("elif")) {
			this.eat("name");
			const t2 = this.expr();
			arms.push({
				test: t2,
				body: this.suite()
			});
			this.skipNl();
		}
		let els = [];
		if (this.isName("else")) {
			this.eat("name");
			els = this.suite();
		}
		return {
			k: "if",
			arms,
			els
		};
	}
	forStmt() {
		this.eat("name");
		const name = this.eat("name").v;
		if (!this.isName("in")) throw new SyntaxError("for x in");
		this.eat("name");
		return {
			k: "for",
			name,
			iter: this.expr(),
			body: this.suite()
		};
	}
	whileStmt() {
		this.eat("name");
		return {
			k: "while",
			test: this.expr(),
			body: this.suite()
		};
	}
	defStmt() {
		this.eat("name");
		const name = this.eat("name").v;
		this.eat("op", "(");
		const params = this.paramList();
		this.eat("op", ")");
		return {
			k: "def",
			name,
			params,
			body: this.suite()
		};
	}
	classStmt() {
		this.eat("name");
		const name = this.eat("name").v;
		const bases = [];
		if (this.isOp("(")) {
			this.eat("op");
			while (!this.isOp(")")) {
				bases.push(this.expr());
				if (this.isOp(",")) this.eat("op");
				else break;
			}
			this.eat("op", ")");
		}
		return {
			k: "class",
			name,
			bases,
			body: this.suite()
		};
	}
	tryStmt() {
		this.eat("name");
		const body = this.suite();
		this.skipNl();
		const handlers = [];
		while (this.isName("except")) {
			this.eat("name");
			let type = null;
			let name;
			if (!this.isOp(":")) {
				type = this.expr();
				if (this.isName("as")) {
					this.eat("name");
					name = this.eat("name").v;
				}
			}
			handlers.push({
				type,
				name,
				body: this.suite()
			});
			this.skipNl();
		}
		let fin = [];
		if (this.isName("finally")) {
			this.eat("name");
			fin = this.suite();
		}
		if (!handlers.length && !fin.length) throw new SyntaxError("try without except/finally");
		return {
			k: "try",
			body,
			handlers,
			fin
		};
	}
	paramList() {
		const params = [];
		while (!this.isOp(")")) {
			const n = this.eat("name").v;
			let d;
			if (this.isOp("=")) {
				this.eat("op");
				d = this.expr();
			}
			params.push({
				name: n,
				def: d
			});
			if (this.isOp(",")) this.eat("op");
			else break;
		}
		return params;
	}
	expr() {
		if (this.isName("lambda")) return this.lambdaExpr();
		const a = this.orx();
		if (this.isName("if")) {
			this.eat("name");
			const t = this.orx();
			if (!this.isName("else")) throw new SyntaxError("expected else in ternary");
			this.eat("name");
			return {
				k: "ifexp",
				t,
				a,
				b: this.expr()
			};
		}
		return a;
	}
	lambdaExpr() {
		this.eat("name");
		const params = [];
		while (!this.isOp(":")) {
			const n = this.eat("name").v;
			let d;
			if (this.isOp("=")) {
				this.eat("op");
				d = this.expr();
			}
			params.push({
				name: n,
				def: d
			});
			if (this.isOp(",")) this.eat("op");
			else break;
		}
		this.eat("op", ":");
		return {
			k: "lambda",
			params,
			body: this.expr()
		};
	}
	orx() {
		let a = this.andx();
		while (this.isName("or")) {
			this.eat("name");
			a = {
				k: "bin",
				op: "or",
				a,
				b: this.andx()
			};
		}
		return a;
	}
	andx() {
		let a = this.notx();
		while (this.isName("and")) {
			this.eat("name");
			a = {
				k: "bin",
				op: "and",
				a,
				b: this.notx()
			};
		}
		return a;
	}
	notx() {
		if (this.isName("not")) {
			this.eat("name");
			return {
				k: "unary",
				op: "not",
				x: this.notx()
			};
		}
		return this.cmp();
	}
	cmp() {
		let a = this.arith();
		for (;;) {
			if (this.isName("in")) {
				this.eat("name");
				a = {
					k: "bin",
					op: "in",
					a,
					b: this.arith()
				};
				continue;
			}
			if (this.isName("is")) {
				this.eat("name");
				if (this.isName("not")) {
					this.eat("name");
					a = {
						k: "bin",
						op: "isnot",
						a,
						b: this.arith()
					};
				} else a = {
					k: "bin",
					op: "is",
					a,
					b: this.arith()
				};
				continue;
			}
			if (this.isName("not") && this.toks[this.i + 1]?.t === "name" && this.toks[this.i + 1].v === "in") {
				this.eat("name");
				this.eat("name");
				a = {
					k: "bin",
					op: "notin",
					a,
					b: this.arith()
				};
				continue;
			}
			const c = this.cur();
			if (c.t === "op" && [
				"==",
				"!=",
				"<",
				">",
				"<=",
				">="
			].includes(c.v)) {
				this.eat("op");
				a = {
					k: "bin",
					op: c.v,
					a,
					b: this.arith()
				};
				continue;
			}
			break;
		}
		return a;
	}
	arith() {
		let a = this.term();
		while (this.isOp("+") || this.isOp("-")) a = {
			k: "bin",
			op: this.eat("op").v,
			a,
			b: this.term()
		};
		return a;
	}
	term() {
		let a = this.power();
		while (this.isOp("*") || this.isOp("/") || this.isOp("%") || this.isOp("//")) a = {
			k: "bin",
			op: this.eat("op").v,
			a,
			b: this.power()
		};
		return a;
	}
	power() {
		const a = this.unary();
		if (this.isOp("**")) {
			this.eat("op");
			return {
				k: "bin",
				op: "**",
				a,
				b: this.power()
			};
		}
		return a;
	}
	unary() {
		if (this.isOp("+") || this.isOp("-")) return {
			k: "unary",
			op: this.eat("op").v,
			x: this.unary()
		};
		return this.postfix();
	}
	postfix() {
		let x = this.atom();
		for (;;) {
			if (this.isOp(".")) {
				this.eat("op");
				const name = this.eat("name").v;
				x = {
					k: "attr",
					x,
					name
				};
				continue;
			}
			if (this.isOp("[")) {
				this.eat("op");
				let a = null;
				let b = null;
				let c = null;
				let isSlice = false;
				if (!this.isOp(":") && !this.isOp("]")) a = this.expr();
				if (this.isOp(":")) {
					isSlice = true;
					this.eat("op");
					if (!this.isOp(":") && !this.isOp("]")) b = this.expr();
					if (this.isOp(":")) {
						this.eat("op");
						if (!this.isOp("]")) c = this.expr();
					}
				}
				this.eat("op", "]");
				x = isSlice ? {
					k: "slice",
					x,
					a,
					b,
					c
				} : {
					k: "idx",
					x,
					i: a
				};
				continue;
			}
			if (this.isOp("(")) {
				this.eat("op");
				const args = [];
				const kw = [];
				while (!this.isOp(")")) {
					if (this.cur().t === "name" && this.toks[this.i + 1]?.t === "op" && this.toks[this.i + 1].v === "=") {
						const n = this.eat("name").v;
						this.eat("op");
						kw.push([n, this.expr()]);
					} else args.push(this.expr());
					if (this.isOp(",")) this.eat("op");
					else break;
				}
				this.eat("op", ")");
				x = {
					k: "call",
					x,
					args,
					kw
				};
				continue;
			}
			break;
		}
		return x;
	}
	compTail() {
		if (!this.isName("for")) return null;
		this.eat("name");
		const name = this.eat("name").v;
		if (!this.isName("in")) throw new SyntaxError("comprehension for x in");
		this.eat("name");
		const iter = this.orx();
		let cond;
		if (this.isName("if")) {
			this.eat("name");
			cond = this.orx();
		}
		return {
			name,
			iter,
			cond
		};
	}
	atom() {
		const c = this.cur();
		if (c.t === "num") {
			this.eat("num");
			return {
				k: "num",
				v: c.v
			};
		}
		if (c.t === "str") {
			this.eat("str");
			let v = c.v;
			while (this.cur().t === "str") v += this.eat("str").v;
			return {
				k: "str",
				v
			};
		}
		if (c.t === "name") {
			this.eat("name");
			return {
				k: "name",
				v: c.v
			};
		}
		if (this.isOp("[")) {
			this.eat("op");
			if (this.isOp("]")) {
				this.eat("op");
				return {
					k: "list",
					xs: []
				};
			}
			const first = this.expr();
			const tail = this.compTail();
			if (tail) {
				this.eat("op", "]");
				return {
					k: "listcomp",
					elt: first,
					...tail
				};
			}
			const xs = [first];
			while (this.isOp(",")) {
				this.eat("op");
				if (this.isOp("]")) break;
				xs.push(this.expr());
			}
			this.eat("op", "]");
			return {
				k: "list",
				xs
			};
		}
		if (this.isOp("{")) {
			this.eat("op");
			if (this.isOp("}")) {
				this.eat("op");
				return {
					k: "dict",
					xs: []
				};
			}
			const k = this.expr();
			this.eat("op", ":");
			const v = this.expr();
			const tail = this.compTail();
			if (tail) {
				this.eat("op", "}");
				return {
					k: "dictcomp",
					key: k,
					val: v,
					...tail
				};
			}
			const xs = [[k, v]];
			while (this.isOp(",")) {
				this.eat("op");
				if (this.isOp("}")) break;
				const kk = this.expr();
				this.eat("op", ":");
				const vv = this.expr();
				xs.push([kk, vv]);
			}
			this.eat("op", "}");
			return {
				k: "dict",
				xs
			};
		}
		if (this.isOp("(")) {
			this.eat("op");
			if (this.isOp(")")) {
				this.eat("op");
				return {
					k: "tuple",
					xs: []
				};
			}
			const first = this.expr();
			if (this.isOp(",")) {
				const xs = [first];
				while (this.isOp(",")) {
					this.eat("op");
					if (this.isOp(")")) break;
					xs.push(this.expr());
				}
				this.eat("op", ")");
				return {
					k: "tuple",
					xs
				};
			}
			this.eat("op", ")");
			return first;
		}
		throw new SyntaxError(`unexpected token ${c.t}`);
	}
};
var ReturnSignal = class {
	value;
	constructor(value) {
		this.value = value;
	}
};
var BreakSignal = class {};
var ContinueSignal = class {};
var PyException = class {
	value;
	constructor(value) {
		this.value = value;
	}
};
function truthy(v) {
	if (v == null || v === false) return false;
	if (v === 0 || v === "") return false;
	if (Array.isArray(v) && v.length === 0) return false;
	if (v && typeof v === "object" && v.__len__) return v.__len__() !== 0;
	return true;
}
function pyEq(a, b) {
	if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => pyEq(x, b[i]));
	return a === b;
}
function markPyFn(fn) {
	fn.__pyfn = true;
	return fn;
}
function iterate(it) {
	if (Array.isArray(it)) return it;
	if (typeof it === "string") return [...it];
	if (it && typeof it === "object" && typeof it[Symbol.iterator] === "function") return [...it];
	return [];
}
function pySlice(o, start, end, step) {
	const seq = typeof o === "string" ? [...o] : Array.isArray(o) ? o : null;
	if (!seq) return [];
	const n = seq.length;
	let st = start == null ? null : Number(start);
	let en = end == null ? null : Number(end);
	const sp = step == null ? 1 : Number(step) || 1;
	if (st == null) st = sp > 0 ? 0 : n - 1;
	if (en == null) en = sp > 0 ? n : -n - 1;
	if (st < 0) st += n;
	if (en < 0) en += n;
	const out = [];
	if (sp > 0) {
		for (let i = st; i < en && i < n; i += sp) if (i >= 0) out.push(seq[i]);
	} else for (let i = st; i > en && i >= 0; i += sp) if (i < n) out.push(seq[i]);
	return typeof o === "string" ? out.join("") : out;
}
function pyGet(o, name) {
	if (o == null) throw new Error(`AttributeError: None has no attribute ${name}`);
	if (Array.isArray(o)) {
		if (name === "append") return (x) => {
			o.push(x);
			return null;
		};
		if (name === "pop") return (i) => i == null ? o.pop() : o.splice(Number(i), 1)[0];
		if (name === "extend") return (xs) => {
			o.push(...iterate(xs));
			return null;
		};
		if (name === "insert") return (i, x) => {
			o.splice(Number(i), 0, x);
			return null;
		};
		if (name === "index") return (x) => o.findIndex((v) => pyEq(v, x));
		if (name === "count") return (x) => o.filter((v) => pyEq(v, x)).length;
		if (name === "reverse") return () => {
			o.reverse();
			return null;
		};
		if (name === "sort") return () => {
			o.sort((a, b) => a - b);
			return null;
		};
		if (name === "copy") return () => [...o];
	}
	if (typeof o === "string") {
		if (name === "upper") return () => o.toUpperCase();
		if (name === "lower") return () => o.toLowerCase();
		if (name === "split") return (sep) => o.split(sep ?? " ");
		if (name === "join") return (xs) => iterate(xs).map(String).join(o);
		if (name === "strip") return () => o.trim();
		if (name === "replace") return (a, b) => o.split(String(a)).join(String(b));
		if (name === "startswith") return (s) => o.startsWith(String(s));
		if (name === "endswith") return (s) => o.endsWith(String(s));
		if (name === "find") return (s) => o.indexOf(String(s));
		if (name === "format") return (...args) => {
			let i = 0;
			return o.replace(/\{(\d*)\}/g, (_, n) => String(n === "" ? args[i++] : args[Number(n)]));
		};
	}
	if (o && typeof o === "object") {
		const rec = o;
		if (name in rec || Object.prototype.hasOwnProperty.call(rec, name)) {
			const v = rec[name];
			if (typeof v === "function") {
				if (v.__pyfn) return (...args) => v(o, ...args);
				return v.bind(o);
			}
			return v;
		}
	}
	throw new Error(`AttributeError: object has no attribute '${name}'`);
}
function runPython(source, globals, modules, print) {
	const ast = new Parser(tokenize(source)).file();
	let steps = 0;
	const MAX = 25e4;
	const evalExpr = (x, scope) => {
		switch (x.k) {
			case "num": return x.v;
			case "str": return x.v;
			case "name":
				if (x.v === "True") return true;
				if (x.v === "False") return false;
				if (x.v === "None") return null;
				if (Object.prototype.hasOwnProperty.call(scope, x.v)) return scope[x.v];
				if (x.v in scope) return scope[x.v];
				if (Object.prototype.hasOwnProperty.call(globals, x.v)) return globals[x.v];
				throw new Error(`NameError: name '${x.v}' is not defined`);
			case "list": return x.xs.map((e) => evalExpr(e, scope));
			case "tuple": return x.xs.map((e) => evalExpr(e, scope));
			case "dict": {
				const d = {};
				for (const [k, v] of x.xs) d[String(evalExpr(k, scope))] = evalExpr(v, scope);
				return d;
			}
			case "listcomp": {
				const out = [];
				const local = Object.create(scope);
				for (const item of iterate(evalExpr(x.iter, scope))) {
					local[x.name] = item;
					if (x.cond && !truthy(evalExpr(x.cond, local))) continue;
					out.push(evalExpr(x.elt, local));
				}
				return out;
			}
			case "dictcomp": {
				const d = {};
				const local = Object.create(scope);
				for (const item of iterate(evalExpr(x.iter, scope))) {
					local[x.name] = item;
					if (x.cond && !truthy(evalExpr(x.cond, local))) continue;
					d[String(evalExpr(x.key, local))] = evalExpr(x.val, local);
				}
				return d;
			}
			case "lambda": {
				const capturing = scope;
				return markPyFn((...args) => {
					const local = Object.create(capturing);
					const kw = args.length && args[args.length - 1] && typeof args[args.length - 1] === "object" && args[args.length - 1].__kw ? args.pop().__kw : {};
					x.params.forEach((p, i) => {
						if (i < args.length) local[p.name] = args[i];
						else if (p.name in kw) local[p.name] = kw[p.name];
						else if (p.def) local[p.name] = evalExpr(p.def, capturing);
						else local[p.name] = null;
					});
					return evalExpr(x.body, local);
				});
			}
			case "unary": {
				const v = evalExpr(x.x, scope);
				if (x.op === "not") return !truthy(v);
				if (x.op === "-") return -v;
				return v;
			}
			case "bin": {
				if (x.op === "or") {
					const a = evalExpr(x.a, scope);
					return truthy(a) ? a : evalExpr(x.b, scope);
				}
				if (x.op === "and") {
					const a = evalExpr(x.a, scope);
					return truthy(a) ? evalExpr(x.b, scope) : a;
				}
				const a = evalExpr(x.a, scope);
				const b = evalExpr(x.b, scope);
				switch (x.op) {
					case "+":
						if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
						if (typeof a === "string" || typeof b === "string") return String(a) + String(b);
						return a + b;
					case "-": return a - b;
					case "*":
						if (typeof a === "string") return a.repeat(Number(b));
						if (typeof b === "string") return b.repeat(Number(a));
						if (Array.isArray(a)) return Array.from({ length: Number(b) }, () => a).flat();
						return a * b;
					case "/": return a / b;
					case "//": return Math.floor(a / b);
					case "%": return a % b;
					case "**": return a ** b;
					case "==": return pyEq(a, b);
					case "!=": return !pyEq(a, b);
					case "<": return a < b;
					case ">": return a > b;
					case "<=": return a <= b;
					case ">=": return a >= b;
					case "is": return a === b;
					case "isnot": return a !== b;
					case "in":
						if (typeof b === "string") return b.includes(String(a));
						if (Array.isArray(b)) return b.some((x) => pyEq(x, a));
						if (b && typeof b === "object") return String(a) in b;
						return false;
					case "notin":
						if (typeof b === "string") return !b.includes(String(a));
						if (Array.isArray(b)) return !b.some((x) => pyEq(x, a));
						return true;
				}
				return null;
			}
			case "attr": return pyGet(evalExpr(x.x, scope), x.name);
			case "idx": {
				const o = evalExpr(x.x, scope);
				const i = evalExpr(x.i, scope);
				if (o && typeof o === "object" && typeof o.__getitem__ === "function") return o.__getitem__(i);
				if (Array.isArray(o)) {
					let n = Number(i);
					if (n < 0) n += o.length;
					return o[n];
				}
				if (typeof o === "string") {
					let n = Number(i);
					if (n < 0) n += o.length;
					return o[n];
				}
				return o[String(i)];
			}
			case "slice": return pySlice(evalExpr(x.x, scope), x.a ? evalExpr(x.a, scope) : null, x.b ? evalExpr(x.b, scope) : null, x.c ? evalExpr(x.c, scope) : null);
			case "call": {
				const fn = evalExpr(x.x, scope);
				if (typeof fn !== "function") throw new Error(`TypeError: object is not callable`);
				const args = x.args.map((a) => evalExpr(a, scope));
				if (x.kw.length) {
					const kw = {};
					for (const [n, e] of x.kw) kw[n] = evalExpr(e, scope);
					return fn(...args, { __kw: kw });
				}
				return fn(...args);
			}
			case "ifexp": return truthy(evalExpr(x.t, scope)) ? evalExpr(x.a, scope) : evalExpr(x.b, scope);
		}
	};
	const assignTarget = (target, value, scope, op) => {
		const applyOp = (cur) => {
			if (!op) return value;
			const n = Number(cur);
			const m = Number(value);
			if (op === "+") return n + m;
			if (op === "-") return n - m;
			if (op === "*") return n * m;
			if (op === "/") return n / m;
			return value;
		};
		if (target.k === "tuple" || target.k === "list") {
			const arr = iterate(value);
			target.xs.forEach((t, i) => assignTarget(t, arr[i], scope, op));
			return;
		}
		if (target.k === "name") {
			const next = applyOp(Object.prototype.hasOwnProperty.call(scope, target.v) ? scope[target.v] : globals[target.v]);
			if (Object.prototype.hasOwnProperty.call(scope, target.v) || !(target.v in globals) || scope === globals) scope[target.v] = next;
			else globals[target.v] = next;
			return;
		}
		if (target.k === "attr") {
			const o = evalExpr(target.x, scope);
			o[target.name] = applyOp(o[target.name]);
			return;
		}
		if (target.k === "idx") {
			const o = evalExpr(target.x, scope);
			const i = evalExpr(target.i, scope);
			if (o && typeof o === "object" && typeof o.__setitem__ === "function") {
				o.__setitem__(i, applyOp(void 0));
				return;
			}
			if (Array.isArray(o)) o[Number(i)] = applyOp(o[Number(i)]);
			else o[String(i)] = applyOp(o[String(i)]);
		}
	};
	const makeFn = (params, body, defining) => markPyFn((...args) => {
		const local = Object.create(defining);
		const kw = args.length && args[args.length - 1] && typeof args[args.length - 1] === "object" && args[args.length - 1].__kw ? args.pop().__kw : {};
		params.forEach((p, i) => {
			if (i < args.length) local[p.name] = args[i];
			else if (p.name in kw) local[p.name] = kw[p.name];
			else if (p.def) local[p.name] = evalExpr(p.def, defining);
			else local[p.name] = null;
		});
		try {
			return runBlock(body, local);
		} catch (e) {
			if (e instanceof ReturnSignal) return e.value;
			throw e;
		}
	});
	const runBlock = (body, scope) => {
		let last = null;
		for (const st of body) {
			if (++steps > MAX) throw new Error("RuntimeError: script exceeded step limit");
			last = runStmt(st, scope);
		}
		return last;
	};
	const runStmt = (st, scope) => {
		switch (st.k) {
			case "pass": return null;
			case "break": throw new BreakSignal();
			case "continue": throw new ContinueSignal();
			case "return": throw new ReturnSignal(st.x ? evalExpr(st.x, scope) : null);
			case "raise": throw new PyException(st.x ? evalExpr(st.x, scope) : "Exception");
			case "expr": return evalExpr(st.x, scope);
			case "assign":
				assignTarget(st.target, evalExpr(st.value, scope), scope, st.op);
				return null;
			case "if":
				for (const arm of st.arms) if (truthy(evalExpr(arm.test, scope))) return runBlock(arm.body, scope);
				return runBlock(st.els, scope);
			case "for": {
				const arr = iterate(evalExpr(st.iter, scope));
				for (const item of arr) {
					scope[st.name] = item;
					try {
						runBlock(st.body, scope);
					} catch (e) {
						if (e instanceof BreakSignal) break;
						if (e instanceof ContinueSignal) continue;
						throw e;
					}
				}
				return null;
			}
			case "while": {
				let n = 0;
				while (truthy(evalExpr(st.test, scope))) {
					if (++n > 2e4) throw new Error("RuntimeError: while loop too long");
					try {
						runBlock(st.body, scope);
					} catch (e) {
						if (e instanceof BreakSignal) break;
						if (e instanceof ContinueSignal) continue;
						throw e;
					}
				}
				return null;
			}
			case "def": {
				const fn = makeFn(st.params, st.body, scope);
				scope[st.name] = fn;
				if (scope === globals) globals[st.name] = fn;
				return fn;
			}
			case "class": {
				const proto = Object.create(null);
				const ns = Object.create(scope);
				runBlock(st.body, ns);
				for (const k of Object.keys(ns)) proto[k] = ns[k];
				const cls = markPyFn((...args) => {
					const inst = Object.create(proto);
					inst.__class__ = cls;
					const init = proto.__init__;
					if (typeof init === "function") {
						const kw = args.length && args[args.length - 1] && typeof args[args.length - 1] === "object" && args[args.length - 1].__kw ? args.pop().__kw : {};
						if (init.__pyfn) init(inst, ...args, Object.keys(kw).length ? { __kw: kw } : void 0);
						else init(...args);
					}
					return inst;
				});
				cls.__name__ = st.name;
				Object.assign(cls, proto);
				scope[st.name] = cls;
				if (scope === globals) globals[st.name] = cls;
				return cls;
			}
			case "try": {
				let result = null;
				try {
					result = runBlock(st.body, scope);
				} catch (e) {
					if (e instanceof ReturnSignal || e instanceof BreakSignal || e instanceof ContinueSignal) {
						if (st.fin.length) runBlock(st.fin, scope);
						throw e;
					}
					const val = e instanceof PyException ? e.value : e instanceof Error ? e.message : e;
					const h = st.handlers[0];
					if (h?.name) scope[h.name] = val;
					try {
						result = h ? runBlock(h.body, scope) : null;
					} catch (e2) {
						if (st.fin.length) runBlock(st.fin, scope);
						throw e2;
					}
				}
				if (st.fin.length) runBlock(st.fin, scope);
				return result;
			}
			case "import": {
				const mod = modules[st.name];
				if (!mod) throw new Error(`ImportError: no module named '${st.name}'`);
				const bind = st.as ?? st.name;
				scope[bind] = mod;
				if (scope === globals) globals[bind] = mod;
				return mod;
			}
			case "from": {
				const mod = modules[st.mod] ?? modules[st.mod.split(".")[0]];
				if (!mod) throw new Error(`ImportError: no module named '${st.mod}'`);
				if (st.names === "*") {
					Object.assign(scope, mod);
					if (scope === globals) Object.assign(globals, mod);
				} else for (const n of st.names) {
					scope[n] = mod[n];
					if (scope === globals) globals[n] = mod[n];
				}
				return null;
			}
		}
	};
	try {
		return runBlock(ast, globals);
	} catch (e) {
		if (e instanceof ReturnSignal) return e.value;
		if (e instanceof PyException) throw new Error(String(e.value));
		throw e;
	}
}
function pyKw(args) {
	const pos = [];
	let kw = {};
	for (const a of args) if (a && typeof a === "object" && a.__kw) kw = {
		...kw,
		...a.__kw
	};
	else pos.push(a);
	return {
		pos,
		kw
	};
}
function kwNum(kw, key, fallback) {
	const v = kw[key];
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}
function locOf(kw, fallback = [
	0,
	.5,
	0
]) {
	return asTriple(kw.location ?? kw.loc, fallback);
}
var Vec = class {
	_get;
	_set;
	constructor(_get, _set) {
		this._get = _get;
		this._set = _set;
	}
	get x() {
		return this._get()[0];
	}
	set x(v) {
		const t = this._get();
		this._set([
			Number(v),
			t[1],
			t[2]
		]);
	}
	get y() {
		return this._get()[1];
	}
	set y(v) {
		const t = this._get();
		this._set([
			t[0],
			Number(v),
			t[2]
		]);
	}
	get z() {
		return this._get()[2];
	}
	set z(v) {
		const t = this._get();
		this._set([
			t[0],
			t[1],
			Number(v)
		]);
	}
	toArray() {
		return this._get();
	}
	[Symbol.iterator]() {
		return this._get()[Symbol.iterator]();
	}
};
function wrapMat(id) {
	const get = () => useStudio.getState().objects.find((o) => o.id === id)?.material;
	const set = (patch) => useStudio.getState().patchMaterial(id, patch);
	return {
		get name() {
			return get()?.name ?? "Material";
		},
		set name(v) {
			set({ name: String(v) });
		},
		get base_color() {
			return get()?.color ?? "#c5c6ca";
		},
		set base_color(v) {
			if (typeof v === "string") set({ color: v });
			else {
				const t = asTriple(v, [
					.8,
					.8,
					.8
				]);
				const hex = "#" + [
					t[0],
					t[1],
					t[2]
				].map((c) => Math.max(0, Math.min(255, Math.round(c * 255))).toString(16).padStart(2, "0")).join("");
				set({ color: hex });
			}
		},
		get color() {
			return this.base_color;
		},
		set color(v) {
			this.base_color = v;
		},
		get metallic() {
			return get()?.metalness ?? 0;
		},
		set metallic(v) {
			set({ metalness: Number(v) });
		},
		get metalness() {
			return get()?.metalness ?? 0;
		},
		set metalness(v) {
			set({ metalness: Number(v) });
		},
		get roughness() {
			return get()?.roughness ?? .5;
		},
		set roughness(v) {
			set({ roughness: Number(v) });
		},
		get transmission() {
			return get()?.transmission ?? 0;
		},
		set transmission(v) {
			set({ transmission: Number(v) });
		},
		get clearcoat() {
			return get()?.clearcoat ?? 0;
		},
		set clearcoat(v) {
			set({ clearcoat: Number(v) });
		},
		get ior() {
			return get()?.ior ?? 1.5;
		},
		set ior(v) {
			set({ ior: Number(v) });
		},
		get emission_strength() {
			return get()?.emissiveIntensity ?? 0;
		},
		set emission_strength(v) {
			set({ emissiveIntensity: Number(v) });
		}
	};
}
function wrapObj(id) {
	const st = () => useStudio.getState();
	const get = () => st().objects.find((o) => o.id === id);
	return {
		get name() {
			return get()?.name ?? "";
		},
		set name(v) {
			st().updateObject(id, { name: String(v) });
		},
		get location() {
			return new Vec(() => get()?.position ?? [
				0,
				0,
				0
			], (t) => st().updateObject(id, { position: t }));
		},
		set location(v) {
			st().updateObject(id, { position: asTriple(v) });
		},
		get rotation_euler() {
			return new Vec(() => get()?.rotation ?? [
				0,
				0,
				0
			], (t) => st().updateObject(id, { rotation: t }));
		},
		set rotation_euler(v) {
			st().updateObject(id, { rotation: asTriple(v) });
		},
		get rotation() {
			return this.rotation_euler;
		},
		set rotation(v) {
			this.rotation_euler = v;
		},
		get scale() {
			return new Vec(() => get()?.scale ?? [
				1,
				1,
				1
			], (t) => st().updateObject(id, { scale: t }));
		},
		set scale(v) {
			st().updateObject(id, { scale: asTriple(v, [
				1,
				1,
				1
			]) });
		},
		get material() {
			return wrapMat(id);
		},
		set material(v) {
			if (v && typeof v === "object") {
				const m = v;
				st().patchMaterial(id, {
					...defaultMaterial(m.name ?? "Material"),
					...v
				});
			}
		},
		get visible() {
			return get()?.visible ?? true;
		},
		set visible(v) {
			st().updateObject(id, { visible: !!v });
		},
		get type() {
			return get()?.kind;
		},
		modifier_add: (...args) => {
			const { kw } = pyKw(args);
			const type = String(kw.type ?? args[0] ?? "subdiv").toLowerCase();
			st().addModifier(id, {
				subsurf: "subdiv",
				subdiv: "subdiv",
				mirror: "mirror",
				array: "array",
				solidify: "solidify",
				bevel: "bevel",
				displace: "displace"
			}[type] ?? "subdiv");
		},
		keyframe_insert: (...args) => {
			const { kw } = pyKw(args);
			st().insertKeyframe(id, kw.frame != null ? Number(kw.frame) : void 0);
		}
	};
}
function addPrim(primitive, args) {
	const { kw } = pyKw(args);
	const params = {};
	for (const [k, v] of Object.entries(kw)) {
		if (k === "location" || k === "rotation" || k === "scale" || k === "name") continue;
		if (typeof v === "number" || typeof v === "string") params[k] = v;
	}
	return wrapObj(useStudio.getState().addMesh(primitive, {
		name: kw.name ? String(kw.name) : void 0,
		position: kw.location ? asTriple(kw.location) : void 0,
		rotation: kw.rotation ? asTriple(kw.rotation) : void 0,
		scale: kw.scale ? asTriple(kw.scale, [
			1,
			1,
			1
		]) : void 0,
		params
	}));
}
function fn(handler) {
	return (...args) => {
		const { pos, kw } = pyKw(args);
		return handler(pos, kw);
	};
}
function createBpy(print, extras = {}) {
	return {
		ops: {
			mesh: {
				primitive_cube_add: (...a) => addPrim("cube", a),
				primitive_uv_sphere_add: (...a) => addPrim("sphere", a),
				primitive_ico_sphere_add: (...a) => addPrim("ico", a),
				primitive_cylinder_add: (...a) => addPrim("cylinder", a),
				primitive_cone_add: (...a) => addPrim("cone", a),
				primitive_torus_add: (...a) => addPrim("torus", a),
				primitive_plane_add: (...a) => addPrim("plane", a),
				primitive_capsule_add: (...a) => addPrim("capsule", a),
				primitive_torusknot_add: (...a) => addPrim("knot", a),
				primitive_gear_add: (...a) => addPrim("gear", a),
				primitive_stairs_add: (...a) => addPrim("stairs", a),
				primitive_helix_add: (...a) => addPrim("helix", a),
				primitive_column_add: (...a) => addPrim("column", a),
				primitive_tree_add: (...a) => addPrim("tree", a),
				primitive_rock_add: (...a) => addPrim("rock", a),
				primitive_vase_add: (...a) => addPrim("vase", a),
				primitive_dna_add: (...a) => addPrim("dna", a),
				primitive_rounded_cube_add: (...a) => addPrim("rounded", a)
			},
			object: {
				delete: fn(() => useStudio.getState().removeSelected()),
				duplicate: fn(() => useStudio.getState().duplicateSelected()),
				shade_smooth: fn(() => {
					const id = useStudio.getState().activeId;
					if (id) useStudio.getState().patchMaterial(id, { flat: false });
				}),
				shade_flat: fn(() => {
					const id = useStudio.getState().activeId;
					if (id) useStudio.getState().patchMaterial(id, { flat: true });
				}),
				modifier_add: fn((_p, kw) => {
					const id = useStudio.getState().activeId;
					if (!id) return;
					const type = String(kw.type ?? "SUBSURF").toLowerCase();
					useStudio.getState().addModifier(id, {
						subsurf: "subdiv",
						subdiv: "subdiv",
						mirror: "mirror",
						array: "array",
						solidify: "solidify",
						bevel: "bevel",
						displace: "displace"
					}[type] ?? "subdiv");
				}),
				camera_add: fn((_p, kw) => wrapObj(useStudio.getState().addCamera(locOf(kw, [
					4,
					3,
					5
				])))),
				light_add: fn((_p, kw) => {
					const type = String(kw.type ?? "POINT").toLowerCase();
					const t = [
						"sun",
						"point",
						"spot",
						"area"
					].includes(type) ? type : "point";
					return wrapObj(useStudio.getState().addLight(t, locOf(kw)));
				}),
				select_all: fn(() => {
					useStudio.getState().select(null);
				}),
				hide_view_set: fn(() => useStudio.getState().hideSelected())
			},
			lighting: {
				three_point: fn(() => useStudio.getState().threePointLights()),
				studio: fn((_p, kw) => {
					useStudio.getState().setEnv(kw.preset || "studio", kwNum(kw, "intensity", 1));
				})
			},
			scene: {
				clear: fn(() => useStudio.getState().loadEmpty()),
				lookdev_setup: fn(() => useStudio.getState().loadLookdev()),
				arch_setup: fn(() => useStudio.getState().loadArch())
			},
			anim: {
				keyframe_insert: fn((_p, kw) => useStudio.getState().insertKeyframe(void 0, kw.frame != null ? Number(kw.frame) : void 0)),
				turntable: fn(() => useStudio.getState().insertTurntable())
			},
			render: { render: fn(() => extras.render?.()) }
		},
		data: {
			objects: {
				__getitem__(name) {
					const o = useStudio.getState().objects.find((x) => x.name === String(name));
					if (!o) throw new Error(`KeyError: bpy.data.objects['${name}']`);
					return wrapObj(o.id);
				},
				get(name) {
					const o = useStudio.getState().objects.find((x) => x.name === String(name));
					return o ? wrapObj(o.id) : null;
				}
			},
			materials: { new: fn((_p, kw) => {
				const name = String(kw.name ?? "Material");
				const preset = MATERIAL_PRESETS[name] ?? {};
				return {
					...defaultMaterial(name),
					...preset,
					name
				};
			}) }
		},
		context: {
			get object() {
				const o = activeObject();
				return o ? wrapObj(o.id) : null;
			},
			get active_object() {
				return this.object;
			},
			get selected_objects() {
				const s = useStudio.getState();
				return s.objects.filter((o) => s.selectedIds.includes(o.id)).map((o) => wrapObj(o.id));
			},
			scene: {
				get frame_current() {
					return useStudio.getState().frame;
				},
				set frame_current(v) {
					useStudio.getState().setFrame(Number(v));
				}
			}
		},
		print
	};
}
function Vector(x = 0, y = 0, z = 0) {
	if (Array.isArray(x)) return asTriple(x);
	return asTriple([
		x,
		y,
		z
	]);
}
function executePython(code, extras = {}) {
	const out = [];
	const print = (...args) => {
		const line = args.map((a) => {
			if (a && typeof a === "object" && a.__kw) return "";
			try {
				return typeof a === "string" ? a : JSON.stringify(a);
			} catch {
				return String(a);
			}
		}).filter(Boolean).join(" ");
		out.push(line);
		useStudio.getState().log({
			kind: "out",
			text: line || " "
		});
	};
	const bpy = createBpy((s) => print(s), extras);
	const math = {
		pi: Math.PI,
		tau: Math.PI * 2,
		e: Math.E,
		sin: Math.sin,
		cos: Math.cos,
		tan: Math.tan,
		asin: Math.asin,
		acos: Math.acos,
		atan: Math.atan,
		atan2: Math.atan2,
		sqrt: Math.sqrt,
		floor: Math.floor,
		ceil: Math.ceil,
		abs: Math.abs,
		min: Math.min,
		max: Math.max,
		pow: Math.pow,
		radians: (d) => d * Math.PI / 180,
		degrees: (r) => r * 180 / Math.PI
	};
	const globals = {
		bpy,
		print,
		Vector,
		range: (...args) => {
			const { pos } = pyKw(args);
			const nums = pos.map(Number);
			let start = 0;
			let end = 0;
			let step = 1;
			if (nums.length === 1) end = nums[0];
			else if (nums.length >= 2) {
				start = nums[0];
				end = nums[1];
				if (nums[2]) step = nums[2];
			}
			const arr = [];
			if (step === 0) return arr;
			if (step > 0) for (let i = start; i < end; i += step) arr.push(i);
			else for (let i = start; i > end; i += step) arr.push(i);
			return arr;
		},
		len: (x) => Array.isArray(x) || typeof x === "string" ? x.length : 0,
		int: (x) => parseInt(String(x), 10) || 0,
		float: (x) => Number(x) || 0,
		str: (x) => String(x),
		abs: Math.abs,
		min: Math.min,
		max: Math.max,
		round: Math.round,
		enumerate: (x) => Array.isArray(x) ? x.map((v, i) => [i, v]) : [],
		math,
		pi: Math.PI,
		sum: (xs) => Array.isArray(xs) ? xs.reduce((a, b) => a + Number(b), 0) : 0,
		any: (xs) => Array.isArray(xs) ? xs.some(Boolean) : false,
		all: (xs) => Array.isArray(xs) ? xs.every(Boolean) : false,
		zip: (...args) => {
			const { pos } = pyKw(args);
			const lists = pos.filter(Array.isArray);
			Math.min(...lists.map((l) => l.length), 0) || Math.min(...lists.map((l) => l.length));
			const out = [];
			const len = lists.length ? Math.min(...lists.map((l) => l.length)) : 0;
			for (let i = 0; i < len; i++) out.push(lists.map((l) => l[i]));
			return out;
		},
		sorted: (xs) => Array.isArray(xs) ? [...xs].sort((a, b) => Number(a) - Number(b)) : [],
		reversed: (xs) => Array.isArray(xs) ? [...xs].reverse() : [],
		list: (xs) => Array.isArray(xs) ? [...xs] : xs == null ? [] : [xs],
		dict: (xs) => xs && typeof xs === "object" ? { ...xs } : {},
		bool: (x) => !!x,
		type: (x) => x === null ? "NoneType" : Array.isArray(x) ? "list" : typeof x,
		Exception: (msg) => String(msg ?? "Exception")
	};
	let seed = 1;
	const rnd = () => {
		seed = seed * 16807 % 2147483647;
		return seed / 2147483647;
	};
	const modules = {
		bpy,
		math,
		mathutils: { Vector },
		random: {
			random: rnd,
			seed: (s) => {
				seed = Math.max(1, Number(s) || 1);
				return null;
			},
			randint: (a, b) => Math.floor(rnd() * (Number(b) - Number(a) + 1)) + Number(a),
			uniform: (a, b) => Number(a) + rnd() * (Number(b) - Number(a)),
			choice: (xs) => Array.isArray(xs) && xs.length ? xs[Math.floor(rnd() * xs.length)] : null
		}
	};
	try {
		useStudio.getState().log({
			kind: "in",
			text: ">>> run"
		});
		const result = runPython(code, globals, modules, (s) => print(s));
		if (result != null && result !== void 0) {
			const text = typeof result === "string" ? result : JSON.stringify(result);
			if (text && text !== "null") useStudio.getState().log({
				kind: "out",
				text
			});
		}
		return {
			ok: true,
			output: out
		};
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		useStudio.getState().log({
			kind: "err",
			text: msg
		});
		return {
			ok: false,
			output: out,
			error: msg
		};
	}
}
var KEY = "zynyx.project.v1";
var LEGACY = "lumina.project.v1";
function sanitizeObject(o) {
	let assetUrl = o.assetUrl;
	let mapUrl = o.material?.mapUrl;
	let assetMissing = o.assetMissing ?? false;
	if (assetUrl && isDeadBlobUrl(assetUrl)) {
		assetUrl = void 0;
		assetMissing = true;
	}
	if (mapUrl && isDeadBlobUrl(mapUrl)) mapUrl = void 0;
	return {
		...o,
		assetUrl,
		assetMissing,
		material: {
			...o.material,
			mapUrl
		}
	};
}
function loadProject() {
	if (typeof localStorage === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		const objects = (data.objects ?? []).map(sanitizeObject);
		const missingAssets = objects.filter((o) => o.assetMissing || o.kind === "asset" && !o.assetUrl).length;
		return {
			...data,
			objects,
			missingAssets
		};
	} catch {
		return null;
	}
}
function saveProject() {
	if (typeof localStorage === "undefined") return;
	const s = useStudio.getState();
	const data = {
		objects: s.objects.map(sanitizeObject),
		lang: s.lang,
		envPreset: s.envPreset,
		pythonCode: s.pythonCode,
		shading: s.shading
	};
	try {
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {}
}
function subscribePersist() {
	let t;
	return useStudio.subscribe(() => {
		if (t) clearTimeout(t);
		t = setTimeout(saveProject, 450);
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function NumField({ label, value, onChange, min, max, step = .01 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid grid-cols-[1fr_52px] items-center gap-2 text-2xs text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-10 shrink-0 truncate text-subtle",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "dcc-range w-full",
				type: "range",
				min: min ?? -10,
				max: max ?? 10,
				step,
				value: Number.isFinite(value) ? value : 0,
				onChange: (e) => onChange(Number(e.target.value))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "h-7 rounded-xs border border-border bg-bg-input px-1 text-right font-mono text-2xs text-fg tabular-nums",
			type: "number",
			step,
			value: Number(value.toFixed(3)),
			onChange: (e) => onChange(Number(e.target.value))
		})]
	});
}
function Outliner() {
	const lang = useStudio((s) => s.lang);
	const objects = useStudio((s) => s.objects);
	const selected = useStudio((s) => s.selectedIds);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xs font-medium tracking-wide text-muted uppercase",
				children: t(lang, "outliner")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-2xs text-subtle tabular-nums",
				children: objects.length
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "dcc-scroll flex-1 overflow-auto py-1",
			children: objects.map((o) => {
				const on = selected.includes(o.id);
				const Icon = o.kind === "light" ? Lightbulb : o.kind === "camera" ? Camera : o.kind === "empty" ? Box : Cylinder;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex w-full items-center gap-2 px-3 py-1.5 text-xs", on ? "bg-accent/15 text-fg" : "text-muted hover:bg-bg-hover hover:text-fg", o.parentId && "ps-6"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: (e) => useStudio.getState().select(o.id, e.shiftKey),
						className: "flex min-w-0 flex-1 items-center gap-2 text-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-3.5 shrink-0",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate",
							children: o.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-subtle hover:text-fg",
						onClick: (e) => {
							e.stopPropagation();
							useStudio.getState().updateObject(o.id, { visible: !o.visible });
						},
						"aria-label": t(lang, "visible"),
						children: o.visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-3.5" })
					})]
				}) }, o.id);
			})
		})]
	});
}
function AddShelf() {
	const lang = useStudio((s) => s.lang);
	const prims = Object.keys(PRIMITIVE_DEFAULTS).filter((k) => k !== "baked" && k !== "asset");
	const gens = [
		"gear",
		"stairs",
		"helix",
		"column",
		"tree",
		"rock",
		"vase",
		"dna",
		"text",
		"knot"
	];
	const basics = prims.filter((p) => !gens.includes(p));
	const add = (p) => useStudio.getState().addMesh(p);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "dcc-scroll flex-1 overflow-auto p-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 pb-1 text-2xs font-medium text-subtle uppercase",
				children: t(lang, "primitives")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1",
				children: basics.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => add(p),
					className: "rounded-sm border border-border bg-bg-elevated px-2 py-2 text-2xs text-fg hover:border-border-strong hover:bg-bg-hover",
					children: PRIMITIVE_DEFAULTS[p].label[lang]
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 px-1 pb-1 text-2xs font-medium text-subtle uppercase",
				children: t(lang, "generators")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1",
				children: gens.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => add(p),
					className: "rounded-sm border border-border bg-bg-elevated px-2 py-2 text-2xs text-fg hover:border-border-strong hover:bg-bg-hover",
					children: PRIMITIVE_DEFAULTS[p].label[lang]
				}, p))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 px-1 pb-1 text-2xs font-medium text-subtle uppercase",
				children: t(lang, "characters")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-1",
				children: [
					SAMPLE_CHARACTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							const obj = assetFromSample(c);
							useStudio.getState().addAsset(obj);
							useStudio.getState().setPlaying(true);
							useStudio.getState().setLayout("anim");
						},
						className: "rounded-sm border border-border bg-bg-elevated px-2 py-2 text-start text-2xs text-fg hover:border-border-strong hover:bg-bg-hover",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium",
							children: lang === "fa" ? c.nameFa : c.nameEn
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: c.tag
						})]
					}, c.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							useStudio.getState().appendObjects(mannequinPack());
							useStudio.getState().setPlaying(true);
						},
						className: "rounded-sm border border-border bg-bg-elevated px-2 py-2 text-2xs text-fg hover:bg-bg-hover",
						children: t(lang, "mannequins")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().loadCharacters(),
						className: "rounded-sm bg-accent px-2 py-2 text-2xs font-medium text-accent-fg",
						children: t(lang, "startChars")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 px-1 pb-1 text-2xs font-medium text-subtle uppercase",
				children: t(lang, "lights")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-1",
				children: [
					"sun",
					"point",
					"spot",
					"area"
				].map((L) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => useStudio.getState().addLight(L),
					className: "rounded-sm border border-border bg-bg-elevated px-2 py-2 text-2xs text-fg hover:bg-bg-hover",
					children: L
				}, L))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 grid grid-cols-2 gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => useStudio.getState().addCamera(),
					className: "rounded-sm border border-border bg-bg-elevated px-2 py-2 text-2xs text-fg hover:bg-bg-hover",
					children: t(lang, "cameras")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => useStudio.getState().addEmpty(),
					className: "rounded-sm border border-border bg-bg-elevated px-2 py-2 text-2xs text-fg hover:bg-bg-hover",
					children: "Empty"
				})]
			})
		]
	});
}
function Properties() {
	const lang = useStudio((s) => s.lang);
	const activeId = useStudio((s) => s.activeId);
	const obj = useStudio((s) => s.objects.find((o) => o.id === s.activeId));
	const env = useStudio((s) => s.envPreset);
	const envI = useStudio((s) => s.envIntensity);
	const bloom = useStudio((s) => s.bloom);
	const snap = useStudio((s) => s.snap);
	const ssao = useStudio((s) => s.ssao);
	const showGrid = useStudio((s) => s.showGrid);
	const showGizmo = useStudio((s) => s.showGizmo);
	if (!obj || !activeId) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "dcc-scroll h-full overflow-auto p-3 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-subtle",
				children: t(lang, "nothing")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-2xs font-medium text-subtle uppercase",
				children: t(lang, "world")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-2xs text-muted",
				children: [t(lang, "environment"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "mt-1 h-8 w-full rounded-sm border border-border bg-bg-input px-2 text-xs text-fg",
					value: env,
					onChange: (e) => useStudio.getState().setEnv(e.target.value),
					children: [
						"studio",
						"sunset",
						"night",
						"warehouse",
						"city",
						"dawn",
						"lobby",
						"apartment",
						"forest",
						"park"
					].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p,
						children: p
					}, p))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
				label: t(lang, "envStrength"),
				value: envI,
				min: 0,
				max: 3,
				step: .05,
				onChange: (v) => useStudio.getState().setEnv(env, v)
			}),
			[
				[
					t(lang, "bloom"),
					bloom,
					() => useStudio.getState().setBloom(!bloom)
				],
				[
					t(lang, "snap"),
					snap,
					() => useStudio.getState().setSnap(!snap)
				],
				[
					"SSAO",
					ssao,
					() => useStudio.getState().setSsao(!ssao)
				],
				[
					t(lang, "grid"),
					showGrid,
					() => useStudio.getState().setShowGrid(!showGrid)
				],
				[
					t(lang, "gizmo"),
					showGizmo,
					() => useStudio.getState().setShowGizmo(!showGizmo)
				]
			].map(([label, on, fn]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center justify-between text-2xs text-muted",
				children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: on,
					onChange: fn
				})]
			}, label))
		]
	});
	const u = (p) => useStudio.getState().updateObject(obj.id, p);
	const m = obj.material;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "dcc-scroll h-full overflow-auto p-3 space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-2xs font-medium text-subtle uppercase",
						children: t(lang, "object")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-2xs text-muted",
						children: [t(lang, "name"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1 h-8 w-full rounded-sm border border-border bg-bg-input px-2 text-xs text-fg",
							value: obj.name,
							onChange: (e) => u({ name: e.target.value })
						})]
					}),
					(obj.kind === "asset" || obj.clips && obj.clips.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-2xs text-muted",
						children: [t(lang, "clip"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 h-8 w-full rounded-sm border border-border bg-bg-input px-2 text-xs text-fg",
							value: obj.clipName ?? obj.clips?.[0] ?? "",
							onChange: (e) => useStudio.getState().setClipName(obj.id, e.target.value),
							children: (obj.clips ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))
						})]
					}),
					obj.kind === "asset" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: t(lang, "clipSpeed"),
						value: obj.clipSpeed ?? 1,
						min: .1,
						max: 3,
						step: .05,
						onChange: (v) => useStudio.getState().setClipSpeed(obj.id, v)
					}),
					obj.kind === "asset" && (obj.loadError || obj.assetMissing) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-sm border border-danger/40 bg-danger/10 px-2 py-1.5 text-2xs text-danger",
						children: obj.loadError || t(lang, "reimport")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-2xs font-medium text-subtle uppercase",
					children: t(lang, "transform")
				}), [
					"position",
					"rotation",
					"scale"
				].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xs text-subtle",
						children: t(lang, key === "position" ? "location" : key)
					}), [
						"x",
						"y",
						"z"
					].map((axis, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: axis.toUpperCase(),
						value: obj[key][i],
						min: key === "scale" ? .01 : -20,
						max: key === "scale" ? 8 : 20,
						step: key === "rotation" ? .05 : .05,
						onChange: (v) => {
							const next = [...obj[key]];
							next[i] = v;
							u({ [key]: next });
						}
					}, axis))]
				}, key))]
			}),
			obj.kind === "mesh" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xs font-medium text-subtle uppercase",
							children: t(lang, "material")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: Object.keys(MATERIAL_PRESETS).map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => useStudio.getState().applyPreset(obj.id, name),
								className: "rounded-xs border border-border px-1.5 py-0.5 text-2xs text-muted hover:text-fg",
								children: name
							}, name))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-2xs text-muted",
							children: [t(lang, "color"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "color",
								className: "h-7 w-10 cursor-pointer rounded-xs border border-border bg-transparent",
								value: m.color,
								onChange: (e) => useStudio.getState().patchMaterial(obj.id, { color: e.target.value })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: t(lang, "metalness"),
							value: m.metalness,
							min: 0,
							max: 1,
							step: .01,
							onChange: (v) => useStudio.getState().patchMaterial(obj.id, { metalness: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: t(lang, "roughness"),
							value: m.roughness,
							min: 0,
							max: 1,
							step: .01,
							onChange: (v) => useStudio.getState().patchMaterial(obj.id, { roughness: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: t(lang, "transmission"),
							value: m.transmission,
							min: 0,
							max: 1,
							step: .01,
							onChange: (v) => useStudio.getState().patchMaterial(obj.id, { transmission: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: t(lang, "clearcoat"),
							value: m.clearcoat,
							min: 0,
							max: 1,
							step: .01,
							onChange: (v) => useStudio.getState().patchMaterial(obj.id, { clearcoat: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "IOR",
							value: m.ior,
							min: 1,
							max: 2.5,
							step: .01,
							onChange: (v) => useStudio.getState().patchMaterial(obj.id, { ior: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Emit",
							value: m.emissiveIntensity,
							min: 0,
							max: 8,
							step: .05,
							onChange: (v) => useStudio.getState().patchMaterial(obj.id, { emissiveIntensity: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: t(lang, "opacity"),
							value: m.opacity,
							min: .05,
							max: 1,
							step: .01,
							onChange: (v) => useStudio.getState().patchMaterial(obj.id, { opacity: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: t(lang, "sheen"),
							value: m.sheen,
							min: 0,
							max: 1,
							step: .01,
							onChange: (v) => useStudio.getState().patchMaterial(obj.id, { sheen: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-2xs text-muted",
							children: [t(lang, "texture"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								className: "mt-1 block w-full text-2xs",
								onChange: (e) => {
									const f = e.target.files?.[0];
									if (!f) return;
									const url = URL.createObjectURL(f);
									useStudio.getState().patchMaterial(obj.id, { mapUrl: url });
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex-1 rounded-sm border border-border py-1 text-2xs text-muted",
								onClick: () => useStudio.getState().bakeObject(obj.id),
								children: t(lang, "bake")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex-1 rounded-sm border border-border py-1 text-2xs text-muted",
								onClick: () => useStudio.getState().originToGeometry(),
								children: t(lang, "origin")
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xs font-medium text-subtle uppercase",
							children: t(lang, "modifiers")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: [
								"subdiv",
								"mirror",
								"array",
								"bevel",
								"displace",
								"solidify"
							].map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								title: type,
								onClick: () => useStudio.getState().addModifier(obj.id, type),
								className: "rounded-xs border border-border px-1 py-0.5 text-2xs text-muted hover:text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: type
								})]
							}, type))
						})]
					}), obj.modifiers.map((mod) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-sm border border-border bg-bg-elevated p-2 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-2xs text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: mod.enabled,
									onChange: (e) => useStudio.getState().updateModifier(obj.id, mod.id, {}, e.target.checked)
								}), mod.type]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => useStudio.getState().removeModifier(obj.id, mod.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3 text-subtle" })
							})]
						}), Object.entries(mod.params).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: k,
							value: v,
							min: k.includes("count") || k === "levels" ? 1 : -5,
							max: k.includes("count") || k === "levels" ? 12 : 5,
							step: .05,
							onChange: (nv) => useStudio.getState().updateModifier(obj.id, mod.id, { [k]: nv })
						}, k))]
					}, mod.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-2xs font-medium text-subtle uppercase",
						children: t(lang, "mesh")
					}), Object.entries(obj.params).map(([k, v]) => typeof v === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: k,
						value: v,
						min: 0,
						max: k === "teeth" || k === "steps" || k === "segments" ? 64 : 8,
						step: k === "teeth" || k === "steps" || k === "segments" ? 1 : .05,
						onChange: (nv) => u({ params: {
							...obj.params,
							[k]: nv
						} })
					}, k) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-2xs text-muted",
						children: [k, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1 h-8 w-full rounded-sm border border-border bg-bg-input px-2 text-xs text-fg",
							value: String(v),
							onChange: (e) => u({ params: {
								...obj.params,
								[k]: e.target.value
							} })
						})]
					}, k))]
				})
			] }),
			obj.kind === "light" && obj.light && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-2xs font-medium text-subtle uppercase",
						children: t(lang, "lighting")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-2xs text-muted",
						children: [t(lang, "color"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "color",
							className: "h-7 w-10 rounded-xs border border-border",
							value: obj.light.color,
							onChange: (e) => u({ light: {
								...obj.light,
								color: e.target.value
							} })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: t(lang, "intensity"),
						value: obj.light.intensity,
						min: 0,
						max: 60,
						step: .1,
						onChange: (v) => u({ light: {
							...obj.light,
							intensity: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: t(lang, "distance"),
						value: obj.light.distance,
						min: 0,
						max: 40,
						step: .1,
						onChange: (v) => u({ light: {
							...obj.light,
							distance: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: t(lang, "angle"),
						value: obj.light.angle,
						min: .05,
						max: 1.5,
						step: .01,
						onChange: (v) => u({ light: {
							...obj.light,
							angle: v
						} })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-2xs text-muted",
						children: [t(lang, "shadows"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: obj.light.castShadow,
							onChange: (e) => u({ light: {
								...obj.light,
								castShadow: e.target.checked
							} })
						})]
					})
				]
			}),
			obj.kind === "camera" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
				label: t(lang, "fov"),
				value: obj.cameraFov,
				min: 12,
				max: 90,
				step: 1,
				onChange: (v) => u({ cameraFov: v })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => useStudio.getState().duplicateSelected(),
					className: "flex flex-1 items-center justify-center gap-1 rounded-sm border border-border py-2 text-2xs text-muted hover:text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }),
						" ",
						t(lang, "duplicate")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => useStudio.getState().removeSelected(),
					className: "flex flex-1 items-center justify-center gap-1 rounded-sm border border-border py-2 text-2xs text-danger",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }),
						" ",
						t(lang, "delete")
					]
				})]
			})
		]
	});
}
function Timeline() {
	const lang = useStudio((s) => s.lang);
	const frame = useStudio((s) => s.frame);
	const start = useStudio((s) => s.frameStart);
	const end = useStudio((s) => s.frameEnd);
	const playing = useStudio((s) => s.playing);
	const autoKey = useStudio((s) => s.autoKey);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-11 items-center gap-2 border-t border-border bg-bg-elevated px-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => useStudio.getState().setPlaying(!playing),
				className: "rounded-sm bg-accent px-3 py-1.5 text-2xs font-medium text-accent-fg",
				children: [
					playing ? "■" : "▶",
					" ",
					t(lang, "play")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => useStudio.getState().insertKeyframe(),
				className: "rounded-sm border border-border px-2 py-1.5 text-2xs text-muted hover:text-fg",
				children: t(lang, "keyframe")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => useStudio.getState().insertTurntable(),
				className: "hidden rounded-sm border border-border px-2 py-1.5 text-2xs text-muted hover:text-fg sm:inline",
				children: t(lang, "turntable")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-1 text-2xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: autoKey,
					onChange: (e) => useStudio.getState().setAutoKey(e.target.checked)
				}), t(lang, "autoKey")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "dcc-range min-w-0 flex-1",
				type: "range",
				min: start,
				max: end,
				value: frame,
				onChange: (e) => {
					useStudio.getState().setPlaying(false);
					useStudio.getState().setFrame(Number(e.target.value));
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "w-14 text-end font-mono text-2xs text-fg tabular-nums",
				children: [
					frame,
					"/",
					end
				]
			})
		]
	});
}
var RECIPES = [
	{
		id: "gear",
		cat: "model",
		title: {
			fa: "چرخ‌دنده برنجی",
			en: "Brass gear"
		},
		blurb: {
			fa: "چرخ‌دنده پارامتریک با متریال فلزی",
			en: "Parametric gear with metal lookdev"
		},
		code: `import bpy
from math import pi

bpy.ops.scene.clear()
bpy.ops.mesh.primitive_gear_add(teeth=18, radius=1.15, depth=0.24, hole=0.2, location=(0, 0.2, 0))
g = bpy.context.object
g.name = "Gear"
g.material.base_color = (0.83, 0.62, 0.2, 1)
g.material.metallic = 1.0
g.material.roughness = 0.26
bpy.ops.object.modifier_add(type='BEVEL')
bpy.ops.mesh.primitive_cylinder_add(radius=0.16, depth=0.9, location=(0, 0.15, 0))
ax = bpy.context.object
ax.name = "Axle"
ax.material.base_color = (0.7, 0.7, 0.72)
ax.material.metallic = 1
ax.material.roughness = 0.18
bpy.ops.lighting.three_point()
print("Gear assembled")
`
	},
	{
		id: "orbit",
		cat: "fx",
		title: {
			fa: "مدار کره‌ها",
			en: "Orbiting spheres"
		},
		blurb: {
			fa: "آرایه قطبی با حلقه و متریال شیشه",
			en: "Polar array of glass spheres"
		},
		code: `import bpy
from math import sin, cos, pi

bpy.ops.scene.clear()
bpy.ops.mesh.primitive_ico_sphere_add(radius=0.55, subdiv=2, location=(0, 0.7, 0))
core = bpy.context.object
core.name = "Core"
core.material.base_color = (1.0, 0.45, 0.12)
core.material.emission_strength = 2.4
core.material.roughness = 0.2

n = 12
for i in range(n):
    a = i / n * 2 * pi
    x = cos(a) * 2.2
    z = sin(a) * 2.2
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.22, location=(x, 0.55, z))
    s = bpy.context.object
    s.name = "Orb_" + str(i)
    s.material.transmission = 0.92
    s.material.roughness = 0.04
    s.material.ior = 1.5
    s.material.base_color = (0.85, 0.93, 1.0)

bpy.ops.mesh.primitive_torus_add(radius=2.2, tube=0.04, location=(0, 0.55, 0))
ring = bpy.context.object
ring.name = "Ring"
ring.material.metallic = 1
ring.material.roughness = 0.12
bpy.ops.lighting.studio(preset='night')
print(n, "orbs")
`
	},
	{
		id: "arch",
		cat: "arch",
		title: {
			fa: "ایوان و ستون",
			en: "Colonnade"
		},
		blurb: {
			fa: "ستون‌های مرمری، پله و گلدان مسی",
			en: "Marble columns, stairs and a copper urn"
		},
		code: `import bpy

bpy.ops.scene.arch_setup()
print("Architecture block ready")
`
	},
	{
		id: "dna",
		cat: "model",
		title: {
			fa: "مارپیچ دی‌ان‌ای",
			en: "DNA helix"
		},
		blurb: {
			fa: "تیوب مارپیچ دوتایی علمی",
			en: "Scientific double helix"
		},
		code: `import bpy

bpy.ops.scene.clear()
bpy.ops.mesh.primitive_dna_add(turns=5, radius=0.42, height=3.0, location=(0, 1.5, 0))
h = bpy.context.object
h.name = "Helix"
h.material.base_color = (0.25, 0.62, 0.95)
h.material.roughness = 0.22
h.material.metallic = 0.15
bpy.ops.lighting.three_point()
print("DNA built")
`
	},
	{
		id: "goldknot",
		cat: "lookdev",
		title: {
			fa: "لوک‌دو طلا",
			en: "Gold lookdev"
		},
		blurb: {
			fa: "گره طلا، شیشه و کروم روی میز استودیو",
			en: "Gold knot, glass and chrome on a studio table"
		},
		code: `import bpy

bpy.ops.scene.lookdev_setup()
obj = bpy.data.objects.get("HeroKnot")
if obj:
    obj.material.metallic = 1
    obj.material.roughness = 0.18
print("Lookdev stage")
`
	},
	{
		id: "forest",
		cat: "fx",
		title: {
			fa: "بیشه رویه‌ای",
			en: "Procedural grove"
		},
		blurb: {
			fa: "درخت و صخره با نویز",
			en: "Trees and rocks with noise"
		},
		code: `import bpy
from math import sin, cos, pi

bpy.ops.scene.clear()
bpy.ops.mesh.primitive_plane_add(size=16, location=(0, 0, 0))
ground = bpy.context.object
ground.name = "Terrain"
ground.material.base_color = (0.23, 0.32, 0.18)
ground.material.roughness = 0.9
bpy.ops.object.modifier_add(type='DISPLACE')

for i in range(7):
    a = i / 7 * 2 * pi
    x = cos(a) * 3.2
    z = sin(a) * 3.2
    bpy.ops.mesh.primitive_tree_add(height=2.2 + (i % 3) * 0.25, seed=i + 1, location=(x, 0, z))
    t = bpy.context.object
    t.name = "Tree_" + str(i)
    t.material.base_color = (0.18, 0.38, 0.16)
    t.material.roughness = 0.78

bpy.ops.mesh.primitive_rock_add(radius=0.55, seed=2, location=(0.6, 0.3, 1.1))
r = bpy.context.object
r.material.base_color = (0.38, 0.36, 0.33)
r.material.roughness = 0.92
bpy.ops.lighting.studio(preset='forest')
print("Grove planted")
`
	},
	{
		id: "turntable",
		cat: "anim",
		title: {
			fa: "ترن‌تیبل محصول",
			en: "Product turntable"
		},
		blurb: {
			fa: "کی‌فریم چرخش ۳۶۰ درجه",
			en: "360° rotation keyframes"
		},
		code: `import bpy

obj = bpy.context.object
if obj is None:
    bpy.ops.mesh.primitive_torusknot_add(location=(0, 1.1, 0))
    obj = bpy.context.object
    obj.material.base_color = (0.85, 0.62, 0.18)
    obj.material.metallic = 1
    obj.material.roughness = 0.2
bpy.ops.anim.turntable()
print("Turntable keys on", obj.name)
`
	},
	{
		id: "vase",
		cat: "model",
		title: {
			fa: "گلدان لاتِه",
			en: "Lathe vase"
		},
		blurb: {
			fa: "سطح انقلابی سرامیکی",
			en: "Ceramic lathe surface"
		},
		code: `import bpy

bpy.ops.scene.clear()
bpy.ops.mesh.primitive_vase_add(height=1.8, radius=0.5, location=(0, 0.9, 0))
v = bpy.context.object
v.name = "Vase"
v.material.base_color = (0.93, 0.88, 0.8)
v.material.roughness = 0.24
v.material.roughness = 0.22
v.material.clearcoat = 0.4
bpy.ops.lighting.three_point()
print("Vase thrown")
`
	},
	{
		id: "stairs",
		cat: "arch",
		title: {
			fa: "پله سنگی",
			en: "Stone stair"
		},
		blurb: {
			fa: "پله پارامتریک معماری",
			en: "Parametric architectural stair"
		},
		code: `import bpy

bpy.ops.scene.clear()
bpy.ops.mesh.primitive_stairs_add(steps=10, width=2.0, rise=0.17, run=0.3, location=(0, 0, 0))
s = bpy.context.object
s.name = "Stair"
s.material.base_color = (0.55, 0.52, 0.47)
s.material.roughness = 0.85
bpy.ops.mesh.primitive_column_add(height=2.6, radius=0.22, location=(-1.4, 1.3, 0.2))
c = bpy.context.object
c.material.base_color = (0.9, 0.88, 0.82)
c.material.roughness = 0.3
bpy.ops.lighting.three_point()
print("Stair block")
`
	},
	{
		id: "neon",
		cat: "lookdev",
		title: {
			fa: "نئون و کربن",
			en: "Neon on carbon"
		},
		blurb: {
			fa: "متریال نشری روی سطح کربن",
			en: "Emissive material on carbon"
		},
		code: `import bpy

bpy.ops.scene.clear()
bpy.ops.mesh.primitive_rounded_cube_add(size=1.4, radius=0.12, location=(0, 0.7, 0))
c = bpy.context.object
c.name = "Carbon"
c.material.base_color = (0.06, 0.06, 0.07)
c.material.metallic = 0.65
c.material.roughness = 0.4
bpy.ops.mesh.primitive_torus_add(radius=0.85, tube=0.045, location=(0, 0.7, 0), rotation=(1.5708, 0, 0))
n = bpy.context.object
n.name = "Neon"
n.material.base_color = (0.05, 0.05, 0.05)
n.material.emission_strength = 4.5
n.material.base_color = (0.9, 0.35, 0.08)
bpy.ops.lighting.studio(preset='night')
print("Neon rig")
`
	}
];
function PythonPanel() {
	const lang = useStudio((s) => s.lang);
	const code = useStudio((s) => s.pythonCode);
	const lines = useStudio((s) => s.consoleLines);
	const run = () => {
		executePython(code, { render: () => captureStill() });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col bg-bg-panel",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-3 py-2",
				dir: lang === "fa" ? "rtl" : "ltr",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xs font-medium tracking-wide text-muted uppercase",
					children: t(lang, "script")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().clearConsole(),
						className: "rounded-xs p-1 text-subtle hover:text-fg",
						"aria-label": "clear",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: run,
						className: "inline-flex items-center gap-1 rounded-sm bg-accent px-2 py-1 text-2xs font-medium text-accent-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-3" }), t(lang, "runScript")]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dcc-scroll max-h-28 overflow-auto border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-3 py-1.5 text-2xs font-medium text-subtle uppercase",
					dir: lang === "fa" ? "rtl" : "ltr",
					children: t(lang, "recipes")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1 px-2 pb-2",
					children: RECIPES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							useStudio.getState().setPythonCode(r.code);
							executePython(r.code, { render: () => captureStill() });
						},
						className: "rounded-sm border border-border bg-bg-elevated px-2 py-1 text-2xs text-muted hover:text-fg",
						title: r.blurb[lang],
						children: r.title[lang]
					}, r.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "min-h-[120px] flex-1 resize-none bg-bg-input px-3 py-2 font-mono text-xs leading-relaxed text-fg outline-none",
				spellCheck: false,
				value: code,
				onChange: (e) => useStudio.getState().setPythonCode(e.target.value),
				onKeyDown: (e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
						e.preventDefault();
						run();
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "dcc-scroll h-28 overflow-auto border-t border-border bg-bg px-3 py-2 font-mono text-2xs leading-5",
				children: lines.map((ln, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(ln.kind === "err" && "text-danger", ln.kind === "in" && "text-subtle", ln.kind === "info" && "text-muted", ln.kind === "out" && "text-fg"),
					children: ln.text
				}, i))
			})
		]
	});
}
var Viewport = (0, import_react.lazy)(() => import("./Viewport-XdGZsqc5.mjs").then((m) => ({ default: m.Viewport })));
function isTypingTarget(el) {
	if (!(el instanceof HTMLElement)) return false;
	const tag = el.tagName;
	return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}
function Menu({ label, children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		onMouseLeave: () => setOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			onMouseEnter: () => setOpen(true),
			className: cn("rounded-xs px-2 py-1 text-xs text-muted hover:bg-bg-hover hover:text-fg", open && "bg-bg-hover text-fg"),
			children: label
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-full start-0 z-40 min-w-52 rounded-md border border-border bg-bg-elevated py-1 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
			children
		})]
	});
}
function Item({ onClick, children, kbd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex w-full items-center justify-between gap-6 px-3 py-1.5 text-start text-xs text-fg hover:bg-bg-hover",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children }), kbd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono text-2xs text-subtle",
			children: kbd
		})]
	});
}
function StudioApp() {
	const lang = useStudio((s) => s.lang);
	const layout = useStudio((s) => s.layout);
	const shading = useStudio((s) => s.shading);
	const mode = useStudio((s) => s.mode);
	const transformMode = useStudio((s) => s.transformMode);
	const showWelcome = useStudio((s) => s.showWelcome);
	const showKeys = useStudio((s) => s.showKeys);
	const renderUrl = useStudio((s) => s.renderDataUrl);
	const mobileTab = useStudio((s) => s.mobileTab);
	const sculpt = useStudio((s) => s.sculpt);
	const objectCount = useStudio((s) => s.objects.length);
	const polyCount = useStudio((s) => s.polyCount);
	const snapOn = useStudio((s) => s.snap);
	const fileRef = (0, import_react.useRef)(null);
	const jsonRef = (0, import_react.useRef)(null);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		let cancelled = false;
		let unsub;
		(async () => {
			const saved = loadProject();
			if (cancelled) return;
			if (saved?.objects?.length) {
				const annotated = await annotateMissingAssets(saved.objects);
				if (cancelled) return;
				useStudio.getState().hydrate({
					objects: annotated.objects,
					lang: saved.lang,
					pythonCode: saved.pythonCode,
					envPreset: saved.envPreset,
					shading: saved.shading
				});
				if (annotated.missing) {
					const fa = saved.lang === "fa";
					toast.error(fa ? `${annotated.missing} مدل ذخیره‌شده پیدا نشد — دوباره ایمپورت کنید` : `${annotated.missing} saved model(s) missing — re-import them`);
				}
			} else {
				useStudio.getState().loadCharacters();
				useStudio.setState({
					hydrated: true,
					showWelcome: true
				});
			}
			if (!cancelled) unsub = subscribePersist();
		})();
		return () => {
			cancelled = true;
			unsub?.();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = lang;
		document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
	}, [lang]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (isTypingTarget(e.target)) {
				if ((e.metaKey || e.ctrlKey) && e.key === "Enter") return;
				return;
			}
			const s = useStudio.getState();
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
				e.preventDefault();
				if (e.shiftKey) s.redo();
				else s.undo();
				return;
			}
			if (e.key === "?" || e.shiftKey && e.key === "/") {
				s.setShowKeys(!s.showKeys);
				return;
			}
			if (e.key === " ") {
				e.preventDefault();
				s.setPlaying(!s.playing);
				return;
			}
			if (e.key.toLowerCase() === "g") s.setTransformMode("translate");
			if (e.key.toLowerCase() === "r" && !e.ctrlKey) s.setTransformMode("rotate");
			if (e.key.toLowerCase() === "s" && !e.ctrlKey) s.setTransformMode("scale");
			if (e.key.toLowerCase() === "x" || e.key === "Delete") s.removeSelected();
			if (e.key.toLowerCase() === "h") s.hideSelected();
			if (e.key.toLowerCase() === "z" && !e.ctrlKey && !e.metaKey) {
				const order = [
					"wire",
					"solid",
					"material",
					"rendered"
				];
				const i = order.indexOf(s.shading);
				s.setShading(order[(i + 1) % order.length]);
			}
			if (e.key === "Tab") {
				e.preventDefault();
				s.setMode(s.mode === "object" ? "sculpt" : "object");
			}
			if (e.key === "F12") {
				e.preventDefault();
				if (captureStill()) toast(lang === "fa" ? "رندر آماده است" : "Render ready");
			}
			if (e.shiftKey && e.key.toLowerCase() === "d") {
				e.preventDefault();
				s.duplicateSelected();
			}
			if (e.shiftKey && e.key.toLowerCase() === "a") {
				e.preventDefault();
				s.setMobileTab("scene");
				s.setLayout("model");
			}
			if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				s.bumpFocus();
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c") {
				e.preventDefault();
				s.copySelected();
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "v") {
				e.preventDefault();
				s.pasteClipboard();
			}
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
				e.preventDefault();
				s.joinSelected();
			}
			if (e.code === "Numpad1") s.setViewPreset("front");
			if (e.code === "Numpad3") s.setViewPreset("right");
			if (e.code === "Numpad7") s.setViewPreset("top");
			if (e.code === "Numpad0") s.setViewPreset("camera");
			if (e.code === "Numpad5") s.setViewPreset("persp");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [lang]);
	const renderStill = () => {
		if (captureStill()) toast(lang === "fa" ? "رندر فریم گرفته شد" : "Still captured");
	};
	const layouts = [
		{
			id: "model",
			label: t(lang, "layoutModel")
		},
		{
			id: "lookdev",
			label: t(lang, "layoutLookdev")
		},
		{
			id: "anim",
			label: t(lang, "layoutAnim")
		},
		{
			id: "script",
			label: t(lang, "layoutScript")
		},
		{
			id: "render",
			label: t(lang, "layoutRender")
		}
	];
	const showTimeline = layout === "anim" || layout === "lookdev" || layout === "render";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-center"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-10 shrink-0 items-center gap-1 border-b border-border bg-bg-elevated px-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "me-2 flex items-center gap-2 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium tracking-tight",
							children: "ZYNYX"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden items-center md:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
								label: t(lang, "file"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().loadEmpty(),
										children: t(lang, "newScene")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().loadLookdev(),
										children: t(lang, "lookdev")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().loadArch(),
										children: t(lang, "startArch")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().loadCharacters(),
										children: t(lang, "startChars")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => fileRef.current?.click(),
										children: t(lang, "importGltf")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => {
											exportSceneGlb().then(() => toast(lang === "fa" ? "GLB با اسکلت و انیمیشن دانلود شد" : "GLB with skeleton & clips downloaded")).catch((err) => toast(String(err)));
										},
										children: t(lang, "exportGltf")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => {
											downloadText("zynyx_scene.py", exportBlenderPython(), "text/x-python");
											toast(lang === "fa" ? "اسکریپت بلندر دانلود شد" : "Blender script downloaded");
										},
										children: t(lang, "exportPy")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: renderStill,
										children: t(lang, "exportPng")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => exportProjectJson(),
										children: t(lang, "exportJson")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => jsonRef.current?.click(),
										children: t(lang, "importJson")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
								label: t(lang, "edit"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "⌘Z",
										onClick: () => useStudio.getState().undo(),
										children: t(lang, "undo")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "⇧⌘Z",
										onClick: () => useStudio.getState().redo(),
										children: t(lang, "redo")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "⌘C",
										onClick: () => useStudio.getState().copySelected(),
										children: t(lang, "copy")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "⌘V",
										onClick: () => useStudio.getState().pasteClipboard(),
										children: t(lang, "paste")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "⇧D",
										onClick: () => useStudio.getState().duplicateSelected(),
										children: t(lang, "duplicate")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "X",
										onClick: () => useStudio.getState().removeSelected(),
										children: t(lang, "delete")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().parentSelected(),
										children: t(lang, "parentTo")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().unparentSelected(),
										children: t(lang, "unparent")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "⌘J",
										onClick: () => useStudio.getState().joinSelected(),
										children: t(lang, "join")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
								label: t(lang, "add"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().addMesh("cube"),
										children: "Cube"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().addMesh("sphere"),
										children: "UV Sphere"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().addMesh("gear"),
										children: "Gear"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().addMesh("column"),
										children: "Column"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().loadCharacters(),
										children: t(lang, "characters")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										onClick: () => useStudio.getState().addLight("sun"),
										children: "Sun"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
								label: t(lang, "lighting"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onClick: () => useStudio.getState().threePointLights(),
									children: t(lang, "threePoint")
								}), ENV_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item, {
									onClick: () => useStudio.getState().setEnv(p),
									children: ["HDRI ", p]
								}, p))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
								label: t(lang, "render"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									kbd: "F12",
									onClick: renderStill,
									children: t(lang, "renderStill")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
									onClick: () => useStudio.getState().setShading("rendered"),
									children: t(lang, "rendered")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, {
								label: t(lang, "help"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "?",
										onClick: () => useStudio.getState().setShowKeys(true),
										children: t(lang, "shortcuts")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "F",
										onClick: () => useStudio.getState().bumpFocus(),
										children: t(lang, "focus")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "1",
										onClick: () => useStudio.getState().setViewPreset("front"),
										children: t(lang, "viewFront")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "3",
										onClick: () => useStudio.getState().setViewPreset("right"),
										children: t(lang, "viewRight")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "7",
										onClick: () => useStudio.getState().setViewPreset("top"),
										children: t(lang, "viewTop")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "0",
										onClick: () => useStudio.getState().setViewPreset("camera"),
										children: t(lang, "viewCam")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
										kbd: "5",
										onClick: () => useStudio.getState().setViewPreset("persp"),
										children: t(lang, "viewPersp")
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ms-auto flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden overflow-hidden rounded-sm border border-border sm:flex",
							children: layouts.map((L) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => useStudio.getState().setLayout(L.id),
								className: cn("px-2 py-1 text-2xs", layout === L.id ? "bg-bg-hover text-fg" : "text-muted hover:text-fg"),
								children: L.label
							}, L.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => useStudio.getState().setLang(lang === "fa" ? "en" : "fa"),
							className: "rounded-sm border border-border px-2 py-1 text-2xs text-muted hover:text-fg",
							children: lang === "fa" ? "EN" : "فا"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-9 shrink-0 items-center gap-1 border-b border-border bg-bg-panel px-2",
				children: [
					[
						["translate", Move],
						["rotate", RotateCw],
						["scale", Scaling]
					].map(([m, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().setTransformMode(m),
						className: cn("rounded-xs p-1.5", transformMode === m ? "bg-accent text-accent-fg" : "text-muted hover:bg-bg-hover hover:text-fg"),
						"aria-label": m,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-4",
							strokeWidth: 1.75
						})
					}, m)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-4 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().setMode(mode === "object" ? "sculpt" : "object"),
						className: cn("rounded-xs px-2 py-1 text-2xs", mode === "sculpt" ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"),
						children: mode === "sculpt" ? t(lang, "sculpt") : t(lang, "objectMode")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-4 w-px bg-border" }),
					[
						"wire",
						"solid",
						"material",
						"rendered"
					].map((sh) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().setShading(sh),
						className: cn("rounded-xs px-2 py-1 text-2xs", shading === sh ? "text-fg" : "text-subtle hover:text-fg"),
						children: t(lang, sh === "wire" ? "wire" : sh === "solid" ? "solid" : sh === "rendered" ? "rendered" : "material")
					}, sh)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().setShowGrid(!useStudio.getState().showGrid),
						className: "ms-1 rounded-xs p-1.5 text-muted hover:text-fg",
						"aria-label": "grid",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().setSnap(!useStudio.getState().snap),
						className: cn("rounded-xs px-2 py-1 text-2xs", snapOn ? "text-accent" : "text-subtle hover:text-fg"),
						children: t(lang, "snap")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().undo(),
						className: "rounded-xs p-1.5 text-muted hover:text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().redo(),
						className: "rounded-xs p-1.5 text-muted hover:text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Redo2, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ms-auto flex items-center gap-1",
						children: [mode === "sculpt" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden items-center gap-2 text-2xs text-muted sm:flex",
							children: [
								[
									"draw",
									"smooth",
									"inflate",
									"grab",
									"clay",
									"pinch",
									"flatten",
									"crease"
								].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => useStudio.getState().setSculpt({ brush: b }),
									className: cn("rounded-xs px-1.5 py-0.5", sculpt.brush === b ? "bg-accent text-accent-fg" : "hover:text-fg"),
									children: b
								}, b)),
								t(lang, "radius"),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "dcc-range w-20",
									type: "range",
									min: .05,
									max: 1.4,
									step: .01,
									value: sculpt.radius,
									onChange: (e) => useStudio.getState().setSculpt({ radius: Number(e.target.value) })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: renderStill,
							className: "inline-flex items-center gap-1 rounded-sm bg-accent px-2.5 py-1 text-2xs font-medium text-accent-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "size-3.5" }), t(lang, "renderStill")]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: cn("w-[220px] shrink-0 border-e border-border bg-bg-panel", mobileTab === "scene" ? "flex" : "hidden md:flex", "flex-col"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-1/2 min-h-0 flex-col border-b border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outliner, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex min-h-0 flex-1 flex-col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddShelf, {})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("relative min-w-0 flex-1 flex-col", mobileTab === "view" || mobileTab === "py" ? "flex" : "hidden md:flex"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative min-h-0 flex-1 bg-viewport",
								children: [mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
									fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex h-full items-center justify-center text-sm text-muted",
										children: [t(lang, "studio"), "…"]
									}),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-full items-center justify-center text-sm text-muted",
									children: [t(lang, "studio"), "…"]
								}), showWelcome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Welcome, {})]
							}),
							showTimeline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, {}),
							layout === "script" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden h-[280px] border-t border-border md:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PythonPanel, {})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: cn("w-[280px] shrink-0 border-s border-border bg-bg-panel", mobileTab === "props" ? "flex" : "hidden lg:flex", "flex-col"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Properties, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-[240px] shrink-0 border-t border-border md:hidden", mobileTab === "py" ? "block" : "hidden"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PythonPanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex h-7 shrink-0 items-center justify-between border-t border-border bg-bg-elevated px-3 text-2xs text-subtle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						objectCount,
						" ",
						t(lang, "objects"),
						" · ",
						polyCount,
						" tris · Y-up · bpy"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "G/R/S · X · ⇧D · Tab · Z · F12 · ?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => useStudio.getState().setShowKeys(true),
						className: "text-muted hover:text-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "size-3.5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex h-12 shrink-0 border-t border-border bg-bg-elevated md:hidden",
				children: [
					["view", t(lang, "studio")],
					["scene", t(lang, "scene")],
					["props", t(lang, "properties")],
					["py", t(lang, "script")]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => useStudio.getState().setMobileTab(id),
					className: cn("flex-1 text-2xs", mobileTab === id ? "text-fg" : "text-muted"),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: jsonRef,
				type: "file",
				accept: "application/json,.json",
				className: "hidden",
				onChange: async (e) => {
					const f = e.target.files?.[0];
					if (!f) return;
					try {
						await importProjectJson(f);
						toast(lang === "fa" ? "پروژه وارد شد" : "Project loaded");
					} catch (err) {
						toast(String(err));
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: IMPORT_ACCEPT,
				multiple: true,
				className: "hidden",
				onChange: async (e) => {
					const files = Array.from(e.target.files ?? []);
					e.target.value = "";
					for (const f of files) try {
						await importAnyFile(f);
						toast(lang === "fa" ? `وارد شد: ${f.name}` : `Imported ${f.name}`);
					} catch (err) {
						toast(String(err));
					}
				}
			}),
			renderUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-4xl rounded-xl border border-border bg-bg-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium",
							children: t(lang, "render")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => downloadDataUrl("zynyx.png", renderUrl),
								className: "inline-flex items-center gap-1 rounded-sm bg-accent px-2 py-1 text-2xs text-accent-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }),
									" ",
									t(lang, "download")
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => useStudio.getState().setRenderDataUrl(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-muted" })
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: renderUrl,
						alt: "render",
						className: "max-h-[70vh] w-full rounded-md object-contain"
					})]
				})
			}),
			showKeys && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeysHelp, {})
		]
	});
}
function Welcome() {
	const lang = useStudio((s) => s.lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 z-10 flex items-end p-4 sm:items-center sm:p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-auto w-full max-w-md rounded-xl border border-border bg-bg-elevated/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xs font-medium tracking-[0.18em] text-accent uppercase",
					children: "ZYNYX"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-medium tracking-tight text-fg",
					children: t(lang, "welcomeTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted text-pretty",
					children: t(lang, "welcomeBody")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								useStudio.getState().loadCharacters();
							},
							className: "rounded-md bg-accent px-3 py-2.5 text-xs font-medium text-accent-fg",
							children: t(lang, "startChars")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => useStudio.getState().loadLookdev(),
							className: "rounded-md border border-border px-3 py-2.5 text-xs text-fg hover:bg-bg-hover",
							children: t(lang, "startLookdev")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => useStudio.getState().loadArch(),
							className: "rounded-md border border-border px-3 py-2.5 text-xs text-fg hover:bg-bg-hover",
							children: t(lang, "startArch")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => useStudio.getState().loadEmpty(),
							className: "rounded-md border border-border px-3 py-2.5 text-xs text-fg hover:bg-bg-hover",
							children: t(lang, "startEmpty")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								useStudio.getState().setShowWelcome(false);
								useStudio.getState().setLayout("script");
								executePython(useStudio.getState().pythonCode);
							},
							className: "inline-flex items-center justify-center gap-1 rounded-md border border-border px-3 py-2.5 text-xs text-fg hover:bg-bg-hover",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode, { className: "size-3.5" }),
								" ",
								t(lang, "startScript")
							]
						})
					]
				})
			]
		})
	});
}
function KeysHelp() {
	const lang = useStudio((s) => s.lang);
	const rows = lang === "fa" ? [
		["G / R / S", "جابه‌جایی، چرخش، مقیاس"],
		["X / Del", "حذف"],
		["⇧ D", "تکثیر"],
		["H", "پنهان"],
		["Tab", "اسکالپت / آبجکت"],
		["Z", "حالت سایه‌زنی"],
		["Space", "پخش انیمیشن"],
		["F12", "رندر فریم"],
		["Ctrl+Z", "بازگردانی"],
		["Ctrl+Enter", "اجرای پایتون"],
		["F", "فوکوس روی انتخاب"],
		["1 / 3 / 7 / 5 / 0", "نماها"],
		["⌘C / ⌘V", "کپی / چسباندن"]
	] : [
		["G / R / S", "Move, rotate, scale"],
		["X / Del", "Delete"],
		["⇧ D", "Duplicate"],
		["H", "Hide"],
		["Tab", "Sculpt / object"],
		["Z", "Cycle shading"],
		["Space", "Play"],
		["F12", "Render still"],
		["Ctrl+Z", "Undo"],
		["Ctrl+Enter", "Run Python"],
		["F", "Focus selected"],
		["1 / 3 / 7 / 5 / 0", "Views"],
		["⌘C / ⌘V", "Copy / paste"]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl border border-border bg-bg-elevated p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: t(lang, "shortcuts")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => useStudio.getState().setShowKeys(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-muted" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-muted",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: v
					})]
				}, k))
			})]
		})
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, {});
}
//#endregion
export { formatLoadError as a, useStudio as c, registerCapture as d, loadRuntime as i, evaluateGeometry as l, t as n, resolveAssetUrl as o, captureRender as r, evalObjectAtFrame as s, routes_exports as t, geometrySignature as u };
