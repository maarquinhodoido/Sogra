import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export async function saveUploadedFile(file: File) {
  if (!file || file.size === 0) {
    return null;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = path.extname(file.name) || ".bin";
  const folder = path.join(process.cwd(), "public", "uploads", new Date().toISOString().slice(0, 7));
  const fileName = `${crypto.randomUUID()}${extension}`;

  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, fileName), buffer);

  return `/uploads/${new Date().toISOString().slice(0, 7)}/${fileName}`;
}
