export function isHeicFile(file) {
  if (!file) return false;
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  return type === 'image/heic' || type === 'image/heif' || /\.(heic|heif)$/.test(name);
}

export async function convertHeicToJpegOrPng(file, toType = 'image/jpeg', quality = 0.92) {
  if (!file) throw new Error('No file provided');
  try {
    const mod = await import('heic2any');
    const heic2any = mod.default || mod;
    const result = await heic2any({ blob: file, toType, quality });
    const blob = Array.isArray(result) ? result[0] : result;
    const ext = toType === 'image/png' ? '.png' : '.jpg';
    const newName = (file.name || 'image').replace(/\.(heic|heif)$/i, ext);
    return new File([blob], newName, { type: toType });
  } catch (err) {
    throw new Error('HEIC conversion failed');
  }
}
