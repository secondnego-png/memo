// 사진을 이 브라우저 저장 공간(약 5MB)에 넣을 수 있게 줄인다.
// 긴 쪽을 1080px까지 줄이고 JPEG로 바꾼다. 한 장에 보통 100~300KB 정도가 된다.
const MAX_SIZE = 1080;
const QUALITY = 0.8;

export async function compressImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas unavailable");
  // 투명한 부분이 검게 나오지 않게 흰 바탕을 먼저 깐다
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", QUALITY);
}
