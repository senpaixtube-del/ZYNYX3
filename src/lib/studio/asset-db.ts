import type { StudioObject } from "./types";

const DB_NAME = "zynyx-assets";
const STORE = "files";

export type AssetRecord = { blob: Blob; name: string; type: string };

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IDB_OPEN_FAILED"));
  });
}

export async function putAssetFile(id: string, blob: Blob, name: string, type: string) {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ blob, name, type }, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("IDB_PUT_FAILED"));
  });
}

export async function getAssetRecord(id: string): Promise<AssetRecord | null> {
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve((req.result as AssetRecord | undefined) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

const urlCache = new Map<string, string>();

export function isIdbUrl(url: string) {
  return url.startsWith("idb:");
}

export function isDeadBlobUrl(url: string) {
  return url.startsWith("blob:");
}

export async function resolveAssetUrl(url: string): Promise<string> {
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

export async function storeFileAsIdb(file: Blob, name: string, type?: string): Promise<string> {
  const id = `f_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
  const mime = type || (file as File).type || "application/octet-stream";
  try {
    await putAssetFile(id, file, name, mime);
    return `idb:${id}`;
  } catch {
    return URL.createObjectURL(file);
  }
}

export async function annotateMissingAssets(objects: StudioObject[]): Promise<{
  objects: StudioObject[];
  missing: number;
}> {
  const next: StudioObject[] = [];
  for (const o of objects) {
    let assetUrl = o.assetUrl;
    let assetMissing = o.assetMissing ?? false;
    let mapUrl = o.material?.mapUrl;
    if (assetUrl && isDeadBlobUrl(assetUrl)) {
      assetUrl = undefined;
      assetMissing = true;
    } else if (assetUrl && isIdbUrl(assetUrl)) {
      const rec = await getAssetRecord(assetUrl.slice(4));
      if (!rec) {
        assetUrl = undefined;
        assetMissing = true;
      }
    }
    if (mapUrl && isDeadBlobUrl(mapUrl)) mapUrl = undefined;
    else if (mapUrl && isIdbUrl(mapUrl)) {
      const rec = await getAssetRecord(mapUrl.slice(4));
      if (!rec) mapUrl = undefined;
    }
    next.push({
      ...o,
      assetUrl,
      assetMissing,
      material: { ...o.material, mapUrl },
    });
  }
  return {
    objects: next,
    missing: next.filter((o) => o.assetMissing || (o.kind === "asset" && !o.assetUrl)).length,
  };
}

export function formatLoadError(err: unknown, name: string, lang: "fa" | "en") {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw === "ASSET_MISSING" || raw === "ASSET_BLOB_DEAD") {
    return lang === "fa"
      ? `${name}: فایل ذخیره‌شده پیدا نشد — دوباره ایمپورت کنید`
      : `${name}: saved file missing — re-import the model`;
  }
  return lang === "fa" ? `لود ناموفق ${name}: ${raw}` : `Load failed ${name}: ${raw}`;
}
