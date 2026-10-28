import path from 'node:path';

/**
 * Where uploaded media lives on disk. Set UPLOAD_DIR to a folder OUTSIDE the
 * deployed app (e.g. /home/user/vanzoo-uploads) in production, so redeploys
 * never delete uploads.
 */
export const uploadDir = () => path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'));

export const ALLOWED: Record<string, { ext: string; mime: string }> = {
  jpg: { ext: 'jpg', mime: 'image/jpeg' },
  jpeg: { ext: 'jpg', mime: 'image/jpeg' },
  png: { ext: 'png', mime: 'image/png' },
  webp: { ext: 'webp', mime: 'image/webp' },
  gif: { ext: 'gif', mime: 'image/gif' },
  avif: { ext: 'avif', mime: 'image/avif' },
};

/** True when the bytes really are the claimed image type (not just the extension). */
export function matchesMagic(ext: string, b: Buffer): boolean {
  const starts = (...bytes: number[]) => bytes.every((v, i) => b[i] === v);
  switch (ALLOWED[ext]?.ext) {
    case 'jpg': return starts(0xff, 0xd8, 0xff);
    case 'png': return starts(0x89, 0x50, 0x4e, 0x47);
    case 'gif': return starts(0x47, 0x49, 0x46, 0x38);
    case 'webp': return b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP';
    case 'avif': return b.slice(4, 12).toString().startsWith('ftypavi');
    default: return false;
  }
}

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
