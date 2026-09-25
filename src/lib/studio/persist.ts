import { isDeadBlobUrl } from "./asset-db";
import { useStudio } from "./store";
import type { StudioObject } from "./types";

const KEY = "zynyx.project.v1";
const LEGACY = "lumina.project.v1";

export interface Persisted {
  objects: StudioObject[];
  lang: "fa" | "en";
  envPreset: string;
  pythonCode: string;
  shading: string;
  missingAssets?: number;
}

function sanitizeObject(o: StudioObject): StudioObject {
  let assetUrl = o.assetUrl;
  let mapUrl = o.material?.mapUrl;
  let assetMissing = o.assetMissing ?? false;
  if (assetUrl && isDeadBlobUrl(assetUrl)) {
    assetUrl = undefined;
    assetMissing = true;
  }
  if (mapUrl && isDeadBlobUrl(mapUrl)) {
    mapUrl = undefined;
  }
  return {
    ...o,
    assetUrl,
    assetMissing,
    material: { ...o.material, mapUrl },
  };
}

export function loadProject(): Persisted | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Persisted;
    const objects = (data.objects ?? []).map(sanitizeObject);
    const missingAssets = objects.filter((o) => o.assetMissing || (o.kind === "asset" && !o.assetUrl)).length;
    return { ...data, objects, missingAssets };
  } catch {
    return null;
  }
}

export function saveProject() {
  if (typeof localStorage === "undefined") return;
  const s = useStudio.getState();
  const data: Persisted = {
    objects: s.objects.map(sanitizeObject),
    lang: s.lang,
    envPreset: s.envPreset,
    pythonCode: s.pythonCode,
    shading: s.shading,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* quota */
  }
}

export function subscribePersist() {
  let t: ReturnType<typeof setTimeout> | undefined;
  return useStudio.subscribe(() => {
    if (t) clearTimeout(t);
    t = setTimeout(saveProject, 450);
  });
}
